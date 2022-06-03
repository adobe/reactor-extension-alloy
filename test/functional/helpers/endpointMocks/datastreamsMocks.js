/*
Copyright 2022 Adobe. All rights reserved.
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

const DATASTREAMS_ENDPOINT_REGEX = /\/datasets\/datastreams\/records\/(\?|$)/;

export const multiple = RequestMock()
  .onRequestTo({
    url: DATASTREAMS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "testsandbox1"
    },
    method: "GET"
  })
  .respond(
    {
      _embedded: {
        records: [
          {
            data: {
              title: "test datastream",
              settings: {
                input: {
                  schemaId: "test schema"
                }
              },
              enabled: true
            },
            orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
            sandboxName: "prod",
            _system: {
              id: "64c31a3b-d031-4a2f-8834-e96fc15d3030",
              revision: 3
            },
            _links: {
              self: {
                href:
                  "/metadata/namespaces/edge/datasets/datastreams/records/64c31a3b-d031-4a2f-8834-e96fc15d3030",
                title: ""
              }
            }
          },
          {
            data: {
              title: "test datastream: stage",
              settings: {
                input: {
                  schemaId: "test schema"
                }
              },
              enabled: true
            },
            orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
            sandboxName: "prod",
            _system: {
              id: "64c31a3b-d031-4a2f-8834-e96fc15d3030:stage",
              revision: 3
            },
            _links: {
              self: {
                href:
                  "/metadata/namespaces/edge/datasets/datastreams/records/64c31a3b-d031-4a2f-8834-e96fc15d3030",
                title: ""
              }
            }
          },
          {
            data: {
              title: "test datastream: development",
              settings: {
                input: {
                  schemaId: "test schema"
                }
              },
              enabled: true
            },
            orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
            sandboxName: "prod",
            _system: {
              id: "64c31a3b-d031-4a2f-8834-e96fc15d3030:dev",
              revision: 3
            },
            _links: {
              self: {
                href:
                  "/metadata/namespaces/edge/datasets/datastreams/records/64c31a3b-d031-4a2f-8834-e96fc15d3030",
                title: ""
              }
            }
          }
        ]
      },
      _links: {
        self: {
          href:
            "/metadata/namespaces/edge/datasets/datastreams/records?limit=1000&orderby=title",
          title: ""
        }
      }
    },
    200,
    responseHeaders
  );

export const empty = RequestMock()
  .onRequestTo({
    url: DATASTREAMS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "prod"
    },
    method: "GET"
  })
  .respond(
    {
      _embedded: {
        records: []
      },
      _links: {
        self: {
          href:
            "/metadata/namespaces/edge/datasets/datastreams/records?limit=1000&orderby=title",
          title: ""
        }
      }
    },
    200,
    responseHeaders
  );
