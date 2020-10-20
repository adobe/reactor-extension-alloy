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

export default ({ orgId, imsAccess, sandboxName, search }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });

  const metaExtends = encodeURIComponent(
    "https://ns.adobe.com/xdm/context/experienceevent"
  );

  const headers = {
    ...baseRequestHeaders,
    // request a summary response with title , $id , meta:altId , and version attributes
    Accept: "application/vnd.adobe.xdm-v2+json"
  };

  if (sandboxName) {
    headers["x-sandbox-name"] = sandboxName;
  } else {
    headers["x-sandbox-name"] = platform.getDefaultSandboxName();
  }

  const path = `/data/foundation/schemaregistry/tenant/schemas`;

  const params = new URLSearchParams();
  params.append("orderby", "title");
  params.append("property", `meta:extends==${metaExtends}`);

  if (search) {
    params.append("property", `title~${search}`);
  }

  // TODO: paginate this response using on responseBody._page.count or responseBody._links.next
  return fetch(
    `${platform.getHost({
      imsAccess
    })}${path}?${params.toString()}`,
    { headers }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("Cannot fetch schemas from schema registry");
      }
      return response.json();
    })
    .then(responseBody => {
      return {
        sandboxName,
        results: responseBody.results
      };
    });
};
