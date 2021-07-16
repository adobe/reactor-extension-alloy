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

import { RequestMock } from "testcafe";
import responseHeaders from "./responseHeaders";

// const EDGE_CONFIG_ENVIRONMENTS_ENDPOINT_REGEX = /environments/;
// const EDGE_CONFIG_PRODUCTION_ENVIRONMENTS_ENDPOINT_REGEX = /environments/;
const EDGE_CONFIG_STAGING_ENVIRONMENTS_ENDPOINT_REGEX = /\/configs\/user\/edge\/environments\?.*type=staging/;
const EDGE_CONFIG_DEVELOPMENT_ENVIRONMENTS_ENDPOINT_REGEX = /\/configs\/user\/edge\/environments\?.*type=development/;

// const optionsRequestMock = RequestMock()
//   .onRequestTo({
//     url: EDGE_CONFIG_ENVIRONMENTS_ENDPOINT_REGEX,
//     method: "OPTIONS"
//   })
//   .respond(undefined, 200, {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers":
//       "authorization, content-type, x-api-key, x-gw-ims-org-id, niner"
//   });

export const singleProduction = RequestMock()
  .onRequestTo({
    url:
      "https://edge.adobe.io/configs/user/edge/EC123/environments?orderby=title&type=production",
    method: "GET"
  })
  .respond(
    {
      foo: "bar",
      _embedded: {
        environments: [
          {
            compositeId: "595cec3c-41e1-45d1-981b-3b12f24a9cc6:jane",
            name: "jane",
            title: "Jane's Production Environment",
            type: "production"
          }
        ]
      },
      page: { size: 20, totalElements: 1, totalPages: 1, number: 1 }
    },
    200,
    responseHeaders
  );
export const singleStaging = RequestMock()
  .onRequestTo({
    url: EDGE_CONFIG_STAGING_ENVIRONMENTS_ENDPOINT_REGEX,
    method: "GET"
  })
  .respond(
    {
      _embedded: {
        environments: [
          {
            compositeId: "595cec3c-41e1-45d1-981b-3b12f24a9cc6:jane",
            name: "jane",
            title: "Jane's Staging Environment",
            type: "staging"
          }
        ]
      },
      page: { size: 20, totalElements: 1, totalPages: 1, number: 1 }
    },
    200,
    responseHeaders
  );

export const singleDevelopment = RequestMock()
  .onRequestTo({
    url: EDGE_CONFIG_DEVELOPMENT_ENVIRONMENTS_ENDPOINT_REGEX,
    method: "GET"
  })
  .respond(
    {
      _embedded: {
        environments: [
          {
            compositeId: "595cec3c-41e1-45d1-981b-3b12f24a9cc6:jane",
            name: "jane",
            title: "Jane's Development Environment",
            type: "development"
          }
        ]
      },
      page: { size: 20, totalElements: 1, totalPages: 1, number: 1 }
    },
    200,
    responseHeaders
  );
