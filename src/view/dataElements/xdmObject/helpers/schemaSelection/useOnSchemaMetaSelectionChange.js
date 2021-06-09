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

import { ACTION_TYPES } from "../mainViewState";
import fetchSchemaUsingAsyncErrorReporting from "./fetchSchemaUsingAsyncErrorReporting";
import getInitialFormStateUsingAsyncErrorReporting from "./getInitialFormStateUsingAsyncErrorReporting";
import abortPreviousRequestsAndCreateNewSignal from "./abortPreviousRequestsAndCreateNewSignal";

const useOnSchemaMetaSelectionChange = ({
  dispatch,
  orgId,
  imsAccess,
  resetForm,
  selectedSandbox,
  reportAsyncError
}) => {
  return async schemaMeta => {
    const signal = abortPreviousRequestsAndCreateNewSignal();

    dispatch({
      type: ACTION_TYPES.SELECTED_SCHEMA_META_CHANGED
    });

    let schema;

    if (schemaMeta) {
      schema = await fetchSchemaUsingAsyncErrorReporting({
        orgId,
        imsAccess,
        sandbox: selectedSandbox,
        schemaId: schemaMeta.$id,
        schemaVersion: schemaMeta.version,
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
    resetForm(initialFormState);
    dispatch({
      type: ACTION_TYPES.SCHEMA_LOADED,
      schema
    });
  };
};

export default useOnSchemaMetaSelectionChange;
