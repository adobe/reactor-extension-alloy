/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import * as STATUS from "../constants/mainViewStatus";

export const ACTION_TYPES = {
  DEFAULT_SANDBOX_AND_SCHEMA_LOADED: "defaultSandboxAndSchemaLoaded",
  SELECTED_SANDBOX_CHANGED: "selectedSandboxChanged",
  SCHEMA_LOADED: "schemaLoaded",
  SELECTED_SCHEMA_META_CHANGED: "selectedSchemaMetaChanged",
  SELECTED_NODE_ID_CHANGED: "selectedNodeIdChanged",
  UPDATE_SHOW_EDITOR_NOT_READY_VALIDATION_ERROR:
    "updateShowEditorNotReadyValidationError"
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.DEFAULT_SANDBOX_AND_SCHEMA_LOADED:
      return {
        ...state,
        status: STATUS.IDLE,
        defaultSelectedSandbox: action.sandbox,
        selectedSandbox: action.sandbox,
        defaultSelectedSchemaMeta: action.schema,
        selectedSchema: action.schema
      };
    case ACTION_TYPES.SELECTED_SANDBOX_CHANGED:
      return {
        ...state,
        status: STATUS.LOADING_NEW_SCHEMA,
        selectedSandbox: action.sandbox,
        selectedSchema: null,
        selectedNodeId: null
      };
    case ACTION_TYPES.SELECTED_SCHEMA_META_CHANGED:
      return {
        ...state,
        status: STATUS.LOADING_NEW_SCHEMA,
        selectedSchema: null,
        selectedNodeId: null
      };
    // Note that schemaLoaded is not dispatched as part of
    // loading the default sandbox and schema; it's only
    // loaded when the selected schema is changing.
    // If anything else is added that dispatches this action, be
    // sure to call Formik's resetForm with the new Formik
    // initial values. It might seem reasonable to call
    // Formik's resetForm from inside this reducer, but
    // React will throw an error.
    case ACTION_TYPES.SCHEMA_LOADED:
      return {
        ...state,
        status: STATUS.IDLE,
        selectedSchema: action.schema
      };
    case ACTION_TYPES.SELECTED_NODE_ID_CHANGED:
      return {
        ...state,
        selectedNodeId: action.nodeId
      };
    case ACTION_TYPES.UPDATE_SHOW_EDITOR_NOT_READY_VALIDATION_ERROR:
      return {
        ...state,
        showEditorNotReadyValidationError:
          action.showEditorNotReadyValidationError
      };
    default:
      throw new Error(`Invalid action: ${action.type}.`);
  }
};
