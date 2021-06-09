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

import fetchSchema from "../fetchSchema";

const fetchSchemaUsingAsyncErrorReporting = async ({
  orgId,
  imsAccess,
  sandbox,
  schemaId,
  schemaVersion,
  signal,
  reportAsyncError
}) => {
  let schema;

  try {
    schema = await fetchSchema({
      orgId,
      imsAccess,
      schemaId,
      schemaVersion,
      sandboxName: sandbox.name,
      signal
    });
  } catch (e) {
    if (e.name !== "AbortError") {
      console.error(e);
      reportAsyncError(new Error(`Failed to load schema. ${e.message}`));
    }
  }

  return schema;
};

export default fetchSchemaUsingAsyncErrorReporting;
