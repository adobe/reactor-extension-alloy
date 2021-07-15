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

const SCHEMA_ENDPOINT_REGEX = /\/schemaregistry\/tenant\/schemas\/.+/;

export const basic = RequestMock()
  .onRequestTo({
    url: SCHEMA_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "alloy-test"
    },
    method: "GET"
  })
  .respond(
    {
      $id: "sch123",
      title: "Test Schema 1",
      version: "1.0",
      type: "object",
      properties: {
        testField: {
          title: "Test Field",
          type: "string"
        }
      }
    },
    200,
    responseHeaders
  );
