/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useRef, useState } from "react";
import { object } from "yup";
import { Item } from "@react-spectrum/combobox";
import { useField } from "formik";
import PropTypes from "prop-types";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import getValueFromFormState from "../dataElements/xdmObject/helpers/getValueFromFormState";
import fetchDataElements from "../utils/fetchDataElements";
import fetchSchema from "../dataElements/xdmObject/helpers/fetchSchema";
import Editor from "../dataElements/xdmObject/components/editor";
import getInitialFormState from "../dataElements/xdmObject/helpers/getInitialFormState";
import FormikPagedComboBox from "../components/formikReactSpectrum3/formikPagedComboBox";
import useReportAsyncError from "../utils/useReportAsyncError";
import fetchDataElement from "../utils/fetchDataElement";
import useChanged from "../utils/useChanged";

const getInitialFormStateFromDataElement = async ({
  dataElement,
  context,
  orgId,
  imsAccess,
  transforms = {},
  data = {}
}) => {
  if (
    dataElement.settings &&
    dataElement.settings.schemaId &&
    dataElement.settings.schemaVersion
  ) {
    const schema = await fetchSchema({
      orgId,
      imsAccess,
      schemaId: dataElement.settings.schemaId,
      schemaVersion: dataElement.settings.schemaVersion,
      sandboxName: dataElement.settings.sandbox
    });
    const newSchema = {
      type: "object",
      properties: {
        xdm: schema
      }
    };
    context.schema = newSchema;
    return getInitialFormState({
      schema: newSchema,
      value: data,
      updateMode: true,
      transforms
    });
  }
  return {};
};

const getInitialValues = context => async ({ initInfo }) => {
  const {
    propertySettings: { id: propertyId } = {},
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const { dataElementId, data = {}, transforms = {} } = initInfo.settings || {};

  const initialValues = {
    data
  };

  const {
    results: dataElementsFirstPage,
    nextPage: dataElementsFirstPageCursor
  } = await fetchDataElements({
    orgId,
    imsAccess,
    propertyId,
    delegateDescriptorId: "adobe-alloy::dataElements::variable"
  });

  context.dataElementsFirstPage = dataElementsFirstPage;
  context.dataElementsFirstPageCursor = dataElementsFirstPageCursor;

  if (dataElementId) {
    const dataElement = await fetchDataElement({
      orgId,
      imsAccess,
      dataElementId
    });
    initialValues.dataElement = dataElement;
    const prefixedTransforms = Object.keys(transforms).reduce((memo, key) => {
      memo[`xdm.${key}`] = transforms[key];
      return memo;
    }, {});
    if (dataElement) {
      const initialFormState = await getInitialFormStateFromDataElement({
        dataElement,
        context,
        orgId,
        imsAccess,
        data: { xdm: data },
        transforms: prefixedTransforms
      });
      return { ...initialValues, ...initialFormState };
    }
  }

  return initialValues;
};

const getSettings = ({ values }) => {
  const { dataElement } = values;
  const { id: dataElementId, settings } = dataElement || {};
  const { cacheId: dataElementCacheId } = settings || {};

  const transforms = {};

  // everything is prefixed with "xdm", lets change that to data.
  const { xdm } = getValueFromFormState({ formStateNode: values, transforms });
  const dataTransforms = Object.keys(transforms).reduce((memo, key) => {
    memo[key.substring(4)] = transforms[key];
    return memo;
  }, {});

  return {
    dataElementId,
    dataElementCacheId,
    data: xdm,
    transforms: dataTransforms
  };
};

const validationSchema = object().shape({
  dataElement: object().required("Please specify a data element.")
});

const UpdateVariable = ({ initInfo, formikProps: { resetForm }, context }) => {
  const {
    schema,
    dataElementsFirstPage,
    dataElementsFirstPageCursor
  } = context;

  const [{ value: dataElement }] = useField("dataElement");
  const [hasSchema, setHasSchema] = useState(schema != null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const {
    propertySettings: { id: propertyId } = {},
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;

  useChanged(
    useReportAsyncError(async () => {
      setHasSchema(false);
      setSelectedNodeId(null);

      if (dataElement) {
        const initialFormState = await getInitialFormStateFromDataElement({
          dataElement,
          context,
          orgId,
          imsAccess
        });
        resetForm({ values: { ...initialFormState, dataElement } });
        if (context.schema) {
          setHasSchema(true);
        }
      }
    }),
    [dataElement?.settings?.schemaId]
  );

  const loadItems = useReportAsyncError(
    async ({ filterText, cursor, signal }) => {
      const { results, nextPage } = await fetchDataElements({
        orgId,
        imsAccess,
        propertyId,
        search: filterText,
        page: cursor || 1,
        signal,
        delegateDescriptorId: "adobe-alloy::dataElements::variable"
      });

      return {
        items: results,
        cursor: nextPage
      };
    }
  );

  return (
    <FormElementContainer>
      <FormikPagedComboBox
        data-test-id="dataElementField"
        name="dataElement"
        label="Data element"
        description="Please specify the data element you would like to update. Only `variable` type data elements are available."
        width="size-5000"
        isRequired
        loadItems={loadItems}
        getKey={item => item?.settings?.cacheId}
        getLabel={item => item?.name}
        firstPage={dataElementsFirstPage}
        firstPageCursor={dataElementsFirstPageCursor}
      >
        {item => <Item key={item.settings.cacheId}>{item.name}</Item>}
      </FormikPagedComboBox>
      {hasSchema && (
        <Editor
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          schema={schema}
          previouslySavedSchemaInfo={null}
          initialExpandedDepth={1}
        />
      )}
    </FormElementContainer>
  );
};

UpdateVariable.propTypes = {
  context: PropTypes.object,
  initInfo: PropTypes.object,
  formikProps: PropTypes.object
};

const UpdateVariableExtensionView = () => {
  const { current: context } = useRef({});

  return (
    <ExtensionView
      getInitialValues={getInitialValues(context)}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={props => {
        return <UpdateVariable context={context} {...props} />;
      }}
    />
  );
};

render(UpdateVariableExtensionView);
