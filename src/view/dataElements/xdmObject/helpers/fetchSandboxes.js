/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import getBaseRequestHeaders from "../../../utils/getBaseRequestHeaders";
import platform from "./platform";

export default ({ orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });

  const DEFAULT_SANDBOX = {
    sandboxes: [
      {
        name: platform.getDefaultSandbox(),
        title: "Prod",
        type: "production",
        isDefault: true,
        region: null,
        state: "active"
      }
    ],
    disabled: true
  };

  return fetch(`${platform.getHost()}/data/foundation/sandbox-management/`, {
    headers: baseRequestHeaders
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Cannot fetch active sandboxes list");
      }
      return response.json();
    })
    .then(responseBody => {
      if (responseBody.sandboxes && responseBody.sandboxes.length === 0) {
        return DEFAULT_SANDBOX;
      }
      return responseBody;
    });
};
