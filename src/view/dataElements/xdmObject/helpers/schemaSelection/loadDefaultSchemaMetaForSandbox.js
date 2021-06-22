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

import fetchSchemasMeta from "../fetchSchemasMeta";
import UserReportableError from "../../../../errors/userReportableError";

const loadDefaultSchemaMetaForSandbox = async ({
  orgId,
  imsAccess,
  sandbox,
  signal,
  reportAsyncError
}) => {
  let schemaMetas;
  let nextPage;
  try {
    ({ results: schemaMetas, nextPage } = await fetchSchemasMeta({
      orgId,
      imsAccess,
      sandboxName: sandbox.name,
      limit: 1,
      signal
    }));
  } catch (e) {
    if (e.name !== "AbortError") {
      reportAsyncError(
        new UserReportableError(`Failed to load schema metadata.`, {
          originatingError: e
        })
      );
    }
    return undefined;
  }

  if (schemaMetas.length === 1 && !nextPage) {
    return schemaMetas[0];
  }

  return undefined;
};

export default loadDefaultSchemaMetaForSandbox;
