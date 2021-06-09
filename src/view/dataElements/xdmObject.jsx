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

import React, { useRef, useEffect, forwardRef, useReducer } from "react";
import PropTypes from "prop-types";
import { Form, ProgressCircle, Flex } from "@adobe/react-spectrum";
import ExtensionView from "../components/spectrum3ExtensionView";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import validate from "./xdmObject/helpers/validate";
import render from "../spectrum3Render";
import Editor from "./xdmObject/components/editor";
import SandboxSelector from "./xdmObject/components/sandboxSelector";
import SchemaMetaSelector from "./xdmObject/components/schemaMetaSelector";
import useReportAsyncError from "../utils/useReportAsyncError";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import * as STATUS from "./xdmObject/constants/mainViewStatus";
import loadDefaultSandbox from "./xdmObject/helpers/schemaSelection/loadDefaultSandbox";
import useOnSandboxSelectionChange from "./xdmObject/helpers/schemaSelection/useOnSandboxSelectionChange";
import useOnSchemaMetaSelectionChange from "./xdmObject/helpers/schemaSelection/useOnSchemaMetaSelectionChange";
import ExtensionViewForm from "../components/extensionViewForm";
import { reducer, ACTION_TYPES } from "./xdmObject/helpers/mainViewState";
import loadDefaultSchema from "./xdmObject/helpers/schemaSelection/loadDefaultSchema";
import getInitialFormStateUsingAsyncErrorReporting from "./xdmObject/helpers/schemaSelection/getInitialFormStateUsingAsyncErrorReporting";
import "./xdmObject.styl";

const XdmObject = forwardRef(({ initInfo, resetForm }, ref) => {
  const {
    settings,
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const reportAsyncError = useReportAsyncError();
  const [state, dispatch] = useReducer(reducer, {
    status: STATUS.INITIALIZING,
    selectedNodeId: null,
    defaultSelectedSandbox: null,
    selectedSandbox: null,
    defaultSelectedSchemaMeta: null,
    selectedSchema: null,
    showEditorNotReadyValidationError: false
  });

  const {
    selectedNodeId,
    status,
    defaultSelectedSandbox,
    selectedSandbox,
    defaultSelectedSchemaMeta,
    selectedSchema,
    showEditorNotReadyValidationError
  } = state;
  const isEditorRenderable = status === STATUS.IDLE && Boolean(selectedSchema);
  const onSandboxSelectionChange = useOnSandboxSelectionChange({
    dispatch,
    orgId,
    imsAccess,
    resetForm,
    reportAsyncError
  });
  const onSchemaMetaSelectionChange = useOnSchemaMetaSelectionChange({
    dispatch,
    orgId,
    imsAccess,
    resetForm,
    selectedSandbox,
    reportAsyncError
  });

  // It might seem desirable to take advantage of the useImperativeHandle hook here,
  // which does something very similar. Unfortunately, when using the useImperative
  // handle, and the user adds an item to an array field (or possibly other things),
  // React sets ref.current to undefined until this component finishes its next render.
  // During that same period of time, Formik attempts to validate the form (because
  // it validates on change) and the parent components calls childRef.current.validateFormikState
  // which throws an error because React has momentarily set childRef.current to undefined.
  useEffect(() => {
    ref.current = {
      getSettings({ values }) {
        const schema = {
          id: selectedSchema.$id,
          version: selectedSchema.version
        };

        return {
          sandbox: {
            name: selectedSandbox.name
          },
          schema,
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      },
      validateFormikState({ values }) {
        // We can't and don't need to do validation on the formik values
        // if the editor isn't even renderable. validateNonFormikState
        // will ensure that the view is properly marked invalid in this
        // case.
        if (!isEditorRenderable) {
          return {};
        }

        return validate(values);
      },
      validateNonFormikState() {
        dispatch({
          type: ACTION_TYPES.UPDATE_SHOW_EDITOR_NOT_READY_VALIDATION_ERROR,
          showEditorNotReadyValidationError: !isEditorRenderable
        });
        return isEditorRenderable;
      }
    };
  });

  useEffect(async () => {
    const sandbox = await loadDefaultSandbox({
      orgId,
      imsAccess,
      settings,
      reportAsyncError
    });

    let schema;

    if (sandbox) {
      schema = await loadDefaultSchema({
        orgId,
        imsAccess,
        settings,
        sandbox,
        reportAsyncError
      });
    }

    let initialFormState;

    if (schema) {
      initialFormState = getInitialFormStateUsingAsyncErrorReporting({
        schema,
        values: settings && settings.data,
        reportAsyncError
      });
    }

    resetForm(initialFormState);
    dispatch({
      type: ACTION_TYPES.DEFAULT_SANDBOX_AND_SCHEMA_LOADED,
      sandbox,
      schema
    });
  }, []);

  useEffect(() => {
    if (isEditorRenderable) {
      dispatch({
        type: ACTION_TYPES.UPDATE_SHOW_EDITOR_NOT_READY_VALIDATION_ERROR,
        showEditorNotReadyValidationError: false
      });
    }
  }, [isEditorRenderable]);

  if (status === STATUS.INITIALIZING) {
    return (
      <FillParentAndCenterChildren>
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </FillParentAndCenterChildren>
    );
  }

  let editorAreaContent = null;

  if (status === STATUS.LOADING_NEW_SCHEMA) {
    editorAreaContent = (
      <Flex alignItems="center" justifyContent="center" height="size-2000">
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </Flex>
    );
  } else if (isEditorRenderable) {
    editorAreaContent = (
      <Editor
        selectedNodeId={selectedNodeId}
        setSelectedNodeId={nodeId => {
          dispatch({
            type: ACTION_TYPES.SELECTED_NODE_ID_CHANGED,
            nodeId
          });
        }}
        schema={selectedSchema}
        previouslySavedSchemaInfo={settings && settings.schema}
      />
    );
  }

  return (
    <div>
      <Form>
        <SandboxSelector
          defaultSelectedSandbox={defaultSelectedSandbox}
          onSelectionChange={onSandboxSelectionChange}
          errorMessage={
            showEditorNotReadyValidationError && !selectedSandbox
              ? "Please select a sandbox."
              : null
          }
        />
        {selectedSandbox ? (
          <SchemaMetaSelector
            defaultSelectedSchemaMeta={defaultSelectedSchemaMeta}
            selectedSandbox={selectedSandbox}
            onSelectionChange={onSchemaMetaSelectionChange}
            errorMessage={
              showEditorNotReadyValidationError
                ? "Please select a schema."
                : null
            }
          />
        ) : null}
      </Form>
      {editorAreaContent}
    </div>
  );
});

XdmObject.propTypes = {
  initInfo: PropTypes.object.isRequired,
  resetForm: PropTypes.func.isRequired
};

const XdmExtensionView = () => {
  const childRef = useRef();

  return (
    <ExtensionView
      render={() => {
        return (
          <ExtensionViewForm
            initialValues={{}}
            getSettings={({ values }) => {
              return childRef.current.getSettings({ values });
            }}
            validateFormikState={({ values }) => {
              return childRef.current.validateFormikState({ values });
            }}
            validateNonFormikState={() => {
              return childRef.current.validateNonFormikState();
            }}
            render={({ initInfo, resetForm }) => {
              return (
                <XdmObject
                  ref={childRef}
                  initInfo={initInfo}
                  resetForm={resetForm}
                />
              );
            }}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
