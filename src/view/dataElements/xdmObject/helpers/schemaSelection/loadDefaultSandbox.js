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

import fetchSandboxes from "../fetchSandboxes";
import DEFAULT_SANDBOX_NAME from "../../constants/defaultSandboxName";

const loadDefaultSandbox = async ({
  orgId,
  imsAccess,
  settings,
  reportAsyncError
}) => {
  let sandboxes;

  try {
    ({ results: sandboxes } = await fetchSandboxes({
      orgId,
      imsAccess
    }));
  } catch (e) {
    console.error(e);
    reportAsyncError(new Error(`Failed to load sandboxes. ${e.message}`));
    return undefined;
  }

  if (!sandboxes.length) {
    reportAsyncError(
      new Error(
        "You do not have access to any sandboxes. Please contact your administrator to be assigned appropriate rights."
      )
    );
    return undefined;
  }

  let defaultSandbox;

  if (settings) {
    // settings.sandbox may not exist because sandboxes were introduced sometime
    // after the XDM Object data element type was released to production. For
    // this reason, we have to check to see if settings.sandbox exists. When
    // Platform added support for sandboxes, they moved all existing schemas
    // to a default "prod" sandbox, which is why we can fall back to
    // DEFAULT_SANDBOX_NAME here.
    const schemaSandboxName = settings.sandbox
      ? settings.sandbox.name
      : DEFAULT_SANDBOX_NAME;

    defaultSandbox = sandboxes.find(
      sandbox => sandbox.name === schemaSandboxName
    );

    if (!defaultSandbox) {
      reportAsyncError(
        new Error(
          "The sandbox used to build the XDM object no longer exists. You will need to re-create this data element using a schema from a different sandbox."
        )
      );
      return undefined;
    }
  }

  if (!defaultSandbox && sandboxes.length) {
    defaultSandbox = sandboxes.find(sandbox => sandbox.isDefault);
  }

  if (!defaultSandbox && sandboxes.length === 1) {
    defaultSandbox = sandboxes[0];
  }

  return defaultSandbox;
};

export default loadDefaultSandbox;
