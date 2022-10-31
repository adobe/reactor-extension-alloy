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

import React, { useRef, useEffect, useState } from "react";
import { object, string } from "yup";
import { Item } from "@react-spectrum/combobox";
import { useField } from "formik";
import PropTypes from "prop-types";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import getValueFromFormState from "../dataElements/xdmObject/helpers/getValueFromFormState";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";
import fetchDataElements from "../utils/fetchDataElements";
import fetchSchema from "../dataElements/xdmObject/helpers/fetchSchema";
import Editor from "../dataElements/xdmObject/components/editor";
import getInitialFormState from "../dataElements/xdmObject/helpers/getInitialFormState";

const getInitialValues = context => async ({ initInfo }) => {
  const {
    propertySettings: { id: propertyId } = {},
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const { dataElement = "", data = {} } = initInfo.settings || {};

  context.dataElements = await fetchDataElements({
    orgId,
    imsAccess,
    propertyId,
    delegateDescriptorIds: ["adobe-alloy::dataElements::variable"]
  });

  return {
    dataElement,
    data
  };
};

const getSettings = ({ values }) => {
  const { dataElement } = values;

  return {
    dataElement,
    data: getValueFromFormState({ formStateNode: values }) || {}
  };
};

const validationSchema = object().shape({
  dataElement: string().required("Please specify a data element.")
});

const UpdateVariable = ({ initInfo, formikProps: { resetForm }, context }) => {
  const [{ value: dataElement }] = useField("dataElement");
  const [hasSchema, setHasSchema] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const { dataElements } = context;
  let { schema } = context;

  useEffect(async () => {
    setHasSchema(false);
    setSelectedNodeId(null);
    const dataElementObject = dataElements.find(
      de => de.settings.cacheId === dataElement
    );
    if (dataElementObject && dataElementObject.settings.schemaId) {
      schema = await fetchSchema({
        orgId,
        imsAccess,
        schemaId: dataElementObject.settings.schemaId,
        schemaVersion: dataElementObject.settings.schemaVersion,
        sandboxName: dataElementObject.settings.sandbox
      });
      if (schema) {
        const initialFormState = getInitialFormState({
          schema: context.schema
        });
        resetForm({ values: { ...initialFormState, dataElement } });
      }
      context.schema = schema;
      setHasSchema(true);
    }
  }, [dataElement]);

  return (
    <FormElementContainer>
      <FormikPicker
        data-test-id="dataElementPicker"
        name="dataElement"
        label="Data element"
        description="Please specify the data element you would like to update. Only `variable` type data elements are available."
        width="size-5000"
        items={dataElements}
        isRequired
      >
        {item => <Item key={item.settings.cacheId}>{item.name}</Item>}
      </FormikPicker>
      {hasSchema && (
        <Editor
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          schema={schema}
          previouslySavedSchemaInfo={null}
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
