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

import getBaseRequestHeaders from "./getBaseRequestHeaders";
import platform from "./platform";

export default ({ orgId, imsAccess }) => {
  const baseRequestHeaders = getBaseRequestHeaders({ orgId, imsAccess });

  // TODO: paginate this response using on responseBody._page.count or responseBody._links.next
  return fetch(
    `${platform.getHost()}/data/foundation/schemaregistry/tenant/schemas?orderby=title`,
    {
      headers: {
        ...baseRequestHeaders,
        // request a summary response with title , $id , meta:altId , and version attributes
        Accept: "application/vnd.adobe.xed-id+json"
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Cannot fetch schemas from schema registry');
      }
      return response.json();
    })
    .then(responseBody => {
      return responseBody.results;
    });
};
