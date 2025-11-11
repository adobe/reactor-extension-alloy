/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(
    "https://platform.adobe.io/data/foundation/sandbox-management/",
    async () => {
      return HttpResponse.json({
        sandboxes: [
          {
            name: "prod",
            title: "Prod",
            state: "active",
            type: "production",
            region: "VA7",
            isDefault: true,
            eTag: -814433214,
            createdDate: "2020-10-18 17:27:15",
            lastModifiedDate: "2020-10-19 17:05:19",
            createdBy: "system",
            lastModifiedBy: "system",
          },
          {
            name: "engonly",
            title: "engonly",
            state: "active",
            type: "development",
            region: "VA7",
            isDefault: false,
            eTag: -457444632,
            createdDate: "2020-10-27 16:04:08",
            lastModifiedDate: "2020-10-27 16:18:14",
            createdBy: "AA4BCC5956653B157F000101@AdobeID",
            lastModifiedBy: "system",
          },
        ],
        _page: {
          limit: 200,
          count: 2,
        },
        _links: {
          page: {
            href: "https://platform.adobe.io:443/data/foundation/sandbox-management/?limit={limit}&offset={offset}",
            templated: true,
          },
        },
      });
    },
  ),
];
