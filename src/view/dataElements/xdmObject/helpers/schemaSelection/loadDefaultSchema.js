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
import fetchSchemaUsingAsyncErrorReporting from "./fetchSchemaUsingAsyncErrorReporting";

const loadDefaultSchema = async ({
  orgId,
  imsAccess,
  settings,
  sandbox,
  reportAsyncError
}) => {
  if (!sandbox) {
    return undefined;
  }

  let defaultSchemaId;
  let defaultSchemaVersion;
  if (settings) {
    defaultSchemaId = settings.schema.id;
    defaultSchemaVersion = settings.schema.version;
  } else {
    const defaultSchemaMeta = await loadDefaultSchemaMetaForSandbox({
      orgId,
      imsAccess,
      sandbox,
      reportAsyncError
    });

    if (defaultSchemaMeta) {
      defaultSchemaId = defaultSchemaMeta.$id;
      defaultSchemaVersion = defaultSchemaMeta.version;
    }
  }

  let schema;

  if (defaultSchemaId && defaultSchemaVersion) {
    schema = await fetchSchemaUsingAsyncErrorReporting({
      orgId,
      imsAccess,
      sandbox,
      schemaId: defaultSchemaId,
      schemaVersion: defaultSchemaVersion,
      reportAsyncError
    });
  }

  return schema;
};

export default loadDefaultSchema;
