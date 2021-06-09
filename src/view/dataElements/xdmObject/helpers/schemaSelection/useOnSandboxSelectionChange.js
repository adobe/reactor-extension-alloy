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

import loadDefaultSchemaMetaForSandbox from "./loadDefaultSchemaMetaForSandbox";
import { ACTION_TYPES } from "../mainViewState";
import fetchSchemaUsingAsyncErrorReporting from "./fetchSchemaUsingAsyncErrorReporting";
import getInitialFormStateUsingAsyncErrorReporting from "./getInitialFormStateUsingAsyncErrorReporting";
import abortPreviousRequestsAndCreateNewSignal from "./abortPreviousRequestsAndCreateNewSignal";

const useOnSandboxSelectionChange = ({
  dispatch,
  orgId,
  imsAccess,
  resetForm,
  reportAsyncError
}) => {
  return async sandbox => {
    const signal = abortPreviousRequestsAndCreateNewSignal();

    dispatch({
      type: ACTION_TYPES.SELECTED_SANDBOX_CHANGED,
      sandbox
    });

    const defaultSchemaMeta = await loadDefaultSchemaMetaForSandbox({
      orgId,
      imsAccess,
      sandbox,
      signal,
      reportAsyncError
    });

    let schema;

    if (defaultSchemaMeta) {
      schema = await fetchSchemaUsingAsyncErrorReporting({
        orgId,
        imsAccess,
        sandbox,
        schemaId: defaultSchemaMeta.$id,
        schemaVersion: defaultSchemaMeta.version,
        signal,
        reportAsyncError
      });
    }

    let initialFormState;

    if (schema) {
      initialFormState = getInitialFormStateUsingAsyncErrorReporting({
        schema,
        reportAsyncError
      });
    }

    resetForm({ values: initialFormState });
    dispatch({
      type: ACTION_TYPES.SCHEMA_LOADED,
      schema
    });
  };
};

export default useOnSandboxSelectionChange;
