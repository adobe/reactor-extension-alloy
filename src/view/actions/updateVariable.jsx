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

import React, { useEffect, useRef, useState } from "react";
import { object } from "yup";
import { Item, Flex, ProgressCircle } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import getValueFromFormState from "../components/objectEditor/helpers/getValueFromFormState";
import fetchDataElements from "../utils/fetchDataElements";
import fetchSchema from "../utils/fetchSchema";
import Editor from "../components/objectEditor/editor";
import getInitialFormState from "../components/objectEditor/helpers/getInitialFormState";
import FormikPagedComboBox from "../components/formikReactSpectrum3/formikPagedComboBox";
import useReportAsyncError from "../utils/useReportAsyncError";
import fetchDataElement from "../utils/fetchDataElement";
import useChanged from "../utils/useChanged";
import Alert from "../components/alert";
import useAbortPreviousRequestsAndCreateSignal from "../utils/useAbortPreviousRequestsAndCreateSignal";
import generateSchemaFromSolutions from "../components/objectEditor/helpers/generateSchemaFromSolutions";
import validate from "../components/objectEditor/helpers/validate";

const getInitialFormStateFromDataElement = async ({
  dataElement,
  context,
  orgId,
  imsAccess,
  transforms = {},
  data = {},
  existingFormStateNode,
  signal
}) => {
  if (
    dataElement.settings &&
    dataElement.settings.schema &&
    dataElement.settings.schema.id &&
    dataElement.settings.schema.version &&
    dataElement.settings.sandbox &&
    dataElement.settings.sandbox.name
  ) {
    let schema;
    try {
      schema = await fetchSchema({
        orgId,
        imsAccess,
        schemaId: dataElement.settings.schema.id,
        schemaVersion: dataElement.settings.schema.version,
        sandboxName: dataElement.settings.sandbox.name,
        signal
      });
    } catch (e) {
      if (e.name !== "AbortError") {
        throw e;
      }
    }
    if (!signal || !signal.aborted) {
      const newSchema = {
        type: "object",
        properties: {
          xdm: schema
        },
        $id: schema.$id,
        version: schema.version
      };
      context.schema = newSchema;
      return getInitialFormState({
        schema: newSchema,
        value: data,
        updateMode: true,
        transforms,
        existingFormStateNode
      });
    }
  }
  if (dataElement?.settings?.solutions) {
    const schema = generateSchemaFromSolutions(dataElement.settings.solutions);
    context.schema = schema;

    return getInitialFormState({
      schema,
      value: data,
      updateMode: true,
      transforms,
      existingFormStateNode
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
  const { dataElementId, transforms = {}, schema: previouslySavedSchemaInfo } =
    initInfo.settings || {};

  let { data = {} } = initInfo.settings || {};

  const initialValues = {
    data
  };

  const {
    results: dataElementsFirstPage,
    nextPage: dataElementsFirstPageCursor
  } = await fetchDataElements({
    orgId,
    imsAccess,
    propertyId
  });

  context.dataElementsFirstPage = dataElementsFirstPage;
  context.dataElementsFirstPageCursor = dataElementsFirstPageCursor;

  let dataElement;
  if (dataElementId) {
    dataElement = await fetchDataElement({
      orgId,
      imsAccess,
      dataElementId
    });
    context.previouslySavedSchemaInfo = previouslySavedSchemaInfo;
  } else if (
    dataElementsFirstPage.length === 1 &&
    dataElementsFirstPageCursor === null
  ) {
    dataElement = dataElementsFirstPage[0];
  }

  initialValues.dataElement = dataElement;

  if (dataElement) {
    const prefixedTransforms = Object.keys(transforms).reduce((memo, key) => {
      // The key for a root element transform is "".
      memo[key === "" ? "xdm" : `xdm.${key}`] = transforms[key];
      return memo;
    }, {});

    if (dataElement?.settings?.solutions?.length > 0) {
      data = { data };
    } else {
      data = { xdm: data };
    }

    const initialFormState = await getInitialFormStateFromDataElement({
      dataElement,
      context,
      orgId,
      imsAccess,
      data,
      transforms: prefixedTransforms
    });

    return { ...initialValues, ...initialFormState };
  }

  return initialValues;
};

const getSettings = context => ({ values }) => {
  const { dataElement } = values;
  const { id: dataElementId, settings } = dataElement || {};
  const { cacheId: dataElementCacheId } = settings || {};

  const transforms = {};

  // everything is prefixed with "xdm", lets change that to data.
  const { xdm, data } =
    getValueFromFormState({ formStateNode: values, transforms }) || {};

  const dataTransforms = Object.keys(transforms).reduce((memo, key) => {
    memo[key.substring(4)] = transforms[key];
    return memo;
  }, {});

  const schema = {
    id: context.schema?.$id,
    version: context.schema?.version
  };

  const response = {
    dataElementId,
    dataElementCacheId,
    data: xdm || data || {}
  };

  if (schema.id) {
    response.schema = schema;
  }

  if (Object.keys(dataTransforms).length > 0) {
    response.transforms = dataTransforms;
  }

  return response;
};

const validationSchema = object().shape({
  dataElement: object().required("Please specify a data element.")
});

const validateFormikState = context => ({ values }) => {
  const { schema } = context;
  if (!schema) {
    return {};
  }

  return validate(values);
};

const UpdateVariable = ({
  initInfo,
  formikProps: { resetForm, values },
  context,
  renderId
}) => {
  const {
    schema,
    dataElementsFirstPage,
    dataElementsFirstPageCursor,
    previouslySavedSchemaInfo
  } = context;

  const [{ value: dataElement }] = useField("dataElement");
  const [hasSchema, setHasSchema] = useState(schema != null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const abortPreviousRequestsAndCreateSignal = useAbortPreviousRequestsAndCreateSignal();

  useEffect(() => {
    setSelectedNodeId(null);
  }, [renderId]);

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
        const transforms = {};
        const signal = abortPreviousRequestsAndCreateSignal();
        const initialFormState = await getInitialFormStateFromDataElement({
          dataElement,
          context,
          orgId,
          imsAccess,
          transforms,
          existingFormStateNode: values,
          signal
        });
        if (!signal.aborted) {
          resetForm({ values: { ...initialFormState, dataElement } });
          if (context.schema) {
            setHasSchema(true);
          }
        }
      }
    }),
    [dataElement?.settings?.schema?.id]
  );

  const loadItems = useReportAsyncError(
    async ({ filterText, cursor, signal }) => {
      const { results, nextPage } = await fetchDataElements({
        orgId,
        imsAccess,
        propertyId,
        search: filterText,
        page: cursor || 1,
        signal
      });

      return {
        items: results,
        cursor: nextPage
      };
    }
  );

  return (
    <FormElementContainer>
      {dataElementsFirstPage.length === 0 && (
        <Alert variant="negative" title="Error" data-test-id="noDataElements">
          No `variable` type data elements are available. Create a variable type
          data element first.
        </Alert>
      )}
      {dataElementsFirstPage.length > 0 && (
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
      )}
      {hasSchema && (
        <Editor
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          schema={schema}
          previouslySavedSchemaInfo={previouslySavedSchemaInfo}
          initialExpandedDepth={1}
          componentName="update variable action"
        />
      )}
      {!hasSchema && dataElement && (
        <Flex alignItems="center" justifyContent="center" height="size-2000">
          <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
        </Flex>
      )}
    </FormElementContainer>
  );
};

UpdateVariable.propTypes = {
  context: PropTypes.object,
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  renderId: PropTypes.number
};

const UpdateVariableExtensionView = () => {
  const { current: context } = useRef({});

  return (
    <ExtensionView
      getInitialValues={getInitialValues(context)}
      getSettings={getSettings(context)}
      formikStateValidationSchema={validationSchema}
      validateFormikState={validateFormikState(context)}
      render={props => {
        return <UpdateVariable context={context} {...props} />;
      }}
    />
  );
};

render(UpdateVariableExtensionView);
