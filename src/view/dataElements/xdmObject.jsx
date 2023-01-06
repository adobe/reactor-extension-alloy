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
import PropTypes from "prop-types";
import { ProgressCircle, Flex } from "@adobe/react-spectrum";
import { useField } from "formik";
import { object, string } from "yup";
import FormElementContainer from "../components/formElementContainer";
import ExtensionView from "../components/extensionView";
import validate from "../components/objectEditor/helpers/validate";
import render from "../render";
import Editor from "../components/objectEditor/editor";
import useReportAsyncError from "../utils/useReportAsyncError";
import useChanged from "../utils/useChanged";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";
import FormikPagedComboBox from "../components/formikReactSpectrum3/formikPagedComboBox";
import DEFAULT_SANDBOX_NAME from "../components/objectEditor/constants/defaultSandboxName";
import fetchSandboxes from "../utils/fetchSandboxes";
import fetchSchemasMeta from "../utils/fetchSchemasMeta";
import fetchSchema from "../utils/fetchSchema";

import getInitialFormState from "../components/objectEditor/helpers/getInitialFormState";
import getValueFromFormState from "../components/objectEditor/helpers/getValueFromFormState";
import UserReportableError from "../errors/userReportableError";
import sandboxItems from "../components/sandboxItems";

const initializeSandboxes = async ({
  context,
  initialValues,
  sandboxName,
  orgId,
  imsAccess
}) => {
  const { results: sandboxes } = await fetchSandboxes({ orgId, imsAccess });

  if (!(sandboxes && sandboxes.length)) {
    throw new UserReportableError(
      "You do not have access to any sandboxes. Please contact your administrator to be assigned appropriate rights.",
      {
        additionalInfoUrl: "https://adobe.ly/3gHkqLF"
      }
    );
  }

  if (sandboxName && !sandboxes.find(s => s.name === sandboxName)) {
    throw new UserReportableError(
      "The sandbox used to build the XDM object no longer exists. You will need to re-create this data element using a schema from a different sandbox."
    );
  }

  if (!sandboxName) {
    let defaultSandbox;
    defaultSandbox = sandboxes.find(sandbox => sandbox.isDefault);
    if (!defaultSandbox && sandboxes.length === 1) {
      defaultSandbox = sandboxes[0];
    }
    if (defaultSandbox) {
      initialValues.sandboxName = defaultSandbox.name;
    }
  }

  context.sandboxes = sandboxes;
};

const initializeSelectedSchema = async ({
  initialValues,
  schemaId,
  schemaVersion,
  context,
  orgId,
  imsAccess
}) => {
  try {
    const { sandboxName } = initialValues;
    if (schemaId && schemaVersion && sandboxName) {
      const schema = await fetchSchema({
        orgId,
        imsAccess,
        schemaId,
        schemaVersion,
        sandboxName
      });
      const { $id, title, version } = schema;
      initialValues.schema2 = { $id, title, version };
      context.schema = schema;
      return;
    }
  } catch (e) {
    throw new UserReportableError(
      "Could not find the schema selected previously. You will need to re-create this data element using a different schema."
    );
  }
  initialValues.schema2 = null;
};

const initializeSchemas = async ({
  initialValues,
  context,
  orgId,
  imsAccess
}) => {
  const { sandboxName } = initialValues;
  const {
    results: schemasFirstPage,
    nextPage: schemasFirstPageCursor
  } = await fetchSchemasMeta({
    orgId,
    imsAccess,
    sandboxName
  });

  if (schemasFirstPage.length === 1 && !schemasFirstPageCursor) {
    const { $id, title, version } = schemasFirstPage[0];
    initialValues.schema2 = { $id, title, version };
  }

  context.schemasFirstPage = schemasFirstPage;
  context.schemasFirstPageCursor = schemasFirstPageCursor;
};

const getInitialValues = context => async ({ initInfo }) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const {
    sandbox: { name: sandboxName } = {},
    schema: { id: schemaId, version: schemaVersion } = {},
    data = {}
  } = initInfo.settings || {};

  const initialValues = {
    sandboxName: sandboxName || ""
  };

  // settings.sandbox may not exist because sandboxes were introduced sometime
  // after the XDM Object data element type was released to production. For
  // this reason, we have to check to see if settings.sandbox exists. When
  // Platform added support for sandboxes, they moved all existing schemas
  // to a default "prod" sandbox, which is why we can fall back to
  // DEFAULT_SANDBOX_NAME here.
  if (schemaId && schemaVersion && !sandboxName) {
    initialValues.sandboxName = DEFAULT_SANDBOX_NAME;
  }

  const args = {
    initialValues,
    context,
    sandboxName,
    schemaId,
    schemaVersion,
    orgId,
    imsAccess
  };

  await initializeSandboxes(args);
  await Promise.all([initializeSelectedSchema(args), initializeSchemas(args)]);

  if (context.schema) {
    const initialFormState = getInitialFormState({
      schema: context.schema,
      value: data
    });
    Object.assign(initialValues, initialFormState);
  }
  return initialValues;
};

const getSettings = context => ({ values }) => {
  const { sandboxName, schema2 } = values || {};

  return {
    sandbox: {
      name: sandboxName
    },
    schema: {
      id: schema2?.$id,
      version: schema2?.version
    },
    data: context.schema
      ? getValueFromFormState({
          formStateNode: { ...values, schema: context.schema }
        }) || {}
      : {}
  };
};

const formikStateValidationSchema = object().shape({
  sandboxName: string().required("Please select a sandbox."),
  schema2: object()
    .nullable()
    .required("Please select a schema.")
});

const validateFormikState = context => ({ values }) => {
  // We can't and don't need to do validation on the formik values
  // if the editor isn't even renderable. validateNonFormikState
  // will ensure that the view is properly marked invalid in this
  // case.
  const { schema } = context;
  if (!schema) {
    return {};
  }

  return validate(values);
};

const validateNonFormikState = context => () => {
  const { schema } = context;
  if (!schema) {
    context.showEditorNotReadyValidationError = true;
    return false;
  }
  return true;
};

const getSchemaKey = item => item && `${item.$id}_${item.version}`;
const getSchemaLabel = item => item?.title;

const XdmObject = ({ initInfo, context, formikProps }) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const settings = initInfo.settings || {};
  const { resetForm } = formikProps;
  const reportAsyncError = useReportAsyncError();

  const {
    sandboxes,
    // sandboxWarning,
    schema,
    // schemaWarning,
    schemasFirstPage,
    schemasFirstPageCursor
    // showEditorNotReadyValidationError
  } = context;

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hasSchema, setHasSchema] = useState(schema != null);

  // const abortPreviousRequestsAndCreateSignal = useAbortPreviousRequestsAndCreateSignal();

  const [{ value: selectedSandboxName }] = useField("sandboxName");
  const [
    { value: selectedSchema },
    ,
    { setValue: setSelectedSchema }
  ] = useField("schema2");

  useChanged(() => {
    setHasSchema(false);
    context.schema = null;
    setSelectedNodeId(null);
    setSelectedSchema(null);
  }, [selectedSandboxName]);

  useChanged(async () => {
    setHasSchema(false);
    context.schema = null;
    setSelectedNodeId(null);

    const newSchema = await fetchSchema({
      orgId,
      imsAccess,
      schemaId: selectedSchema.$id,
      schemaVersion: selectedSchema.version,
      sandboxName: selectedSandboxName
    });
    if (newSchema) {
      context.schema = newSchema;
      const initialFormState = getInitialFormState({
        schema: newSchema
      });
      resetForm({
        values: {
          ...initialFormState,
          schema2: selectedSchema,
          sandboxName: selectedSandboxName
        }
      });
      setHasSchema(true);
    }
  }, [selectedSchema?.$id]);

  const loadSchemas = async ({ filterText, cursor, signal }) => {
    let results;
    let nextPage;
    try {
      ({ results, nextPage } = await fetchSchemasMeta({
        orgId,
        imsAccess,
        sandboxName: selectedSandboxName,
        search: filterText,
        start: cursor,
        signal
      }));
    } catch (e) {
      if (e.name !== "AbortError") {
        reportAsyncError(e);
      }
      // usePagedComboBox expects us to throw an error
      // if we can't produce a valid return object.
      throw e;
    }
    return {
      items: results,
      cursor: nextPage
    };
  };

  let editorAreaContent = null;

  if (selectedSchema && !hasSchema) {
    editorAreaContent = (
      <Flex alignItems="center" justifyContent="center" height="size-2000">
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </Flex>
    );
  } else if (hasSchema) {
    editorAreaContent = (
      <Editor
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={setSelectedNodeId}
        schema={schema}
        previouslySavedSchemaInfo={settings && settings.schema}
      />
    );
  }

  return (
    <div>
      <FormElementContainer>
        <FormikPicker
          label="Sandbox"
          name="sandboxName"
          data-test-id="sandboxField"
          description="Choose a sandbox containing the schema you wish to use."
          items={sandboxes}
          width="size-5000"
          placeholder="Select a sandbox"
        >
          {sandboxItems}
        </FormikPicker>

        <FormikPagedComboBox
          data-test-id="schemaField"
          name="schema2"
          label="Schema"
          width="size-5000"
          loadItems={loadSchemas}
          getKey={getSchemaKey}
          getLabel={getSchemaLabel}
          dependencies={[selectedSandboxName]}
          firstPage={schemasFirstPage}
          firstPageCursor={schemasFirstPageCursor}
        />
      </FormElementContainer>
      {editorAreaContent}
    </div>
  );
};

XdmObject.propTypes = {
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  context: PropTypes.object
};

const XdmExtensionView = () => {
  const { current: context } = useRef({});

  return (
    <ExtensionView
      getInitialValues={getInitialValues(context)}
      getSettings={getSettings(context)}
      formikStateValidationSchema={formikStateValidationSchema}
      validateFormikState={validateFormikState(context)}
      validateNonFormikState={validateNonFormikState(context)}
      render={({ initInfo, formikProps }) => {
        return (
          <XdmObject
            initInfo={initInfo}
            formikProps={formikProps}
            context={context}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
