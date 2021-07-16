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
// import responseHeaders from "./responseHeaders";

const EDGE_CONFIGS_ENDPOINT_REGEX = /\/configs\/user\/edge(\?|$)/;
//
// const optionsRequestMock = RequestMock()
//   .onRequestTo({ url: EDGE_CONFIGS_ENDPOINT_REGEX, method: "OPTIONS" })
//   .respond(undefined, 200, {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers":
//       "authorization, content-type, x-api-key, x-gw-ims-org-id"
//   });

export const single = RequestMock()
  .onRequestTo({
    url: EDGE_CONFIGS_ENDPOINT_REGEX,
    method: "GET"
  })
  .respond(
    {
      foo: "bar"
    },
    200,
    {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, content-type, x-api-key, x-gw-ims-org-id"
    }
  );
