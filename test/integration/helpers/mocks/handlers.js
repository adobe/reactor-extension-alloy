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
            eTag: -414156254,
            createdDate: "2020-05-06 00:16:38",
            lastModifiedDate: "2020-08-05 19:58:59",
            createdBy: "system",
            lastModifiedBy: "system",
          },
          {
            name: "number-two-prod",
            title: "Number Two Prod",
            state: "active",
            type: "production",
            region: "VA7",
            isDefault: false,
            eTag: 182967511,
            createdDate: "2021-07-19 21:40:11",
            lastModifiedDate: "2021-07-19 21:40:11",
            createdBy: "65D103374D76880D0A746C19@AdobeID",
            lastModifiedBy: "65D103374D76880D0A746C19@AdobeID",
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
  http.get(
    "https://edge.adobe.io/metadata/namespaces/edge/datasets/datastreams/records/?orderby=title&limit=1000",
    async () => {
      return HttpResponse.json({
        _embedded: {
          records: [
            {
              data: {
                title: "aep-edge-samples",
                enabled: true,
                settings: {
                  input: {},
                  geo_resolution: "none",
                  state: {
                    first_party_id: {
                      cookie: {
                        enabled: false,
                      },
                    },
                  },
                  com_adobe_identity: {
                    idSyncEnabled: false,
                  },
                  access_type: "mixed",
                  com_adobe_target: {
                    enabled: true,
                    propertyToken: "abf13992-2ba6-fcc7-5d83-885501ed6883",
                  },
                  com_adobe_analytics: {
                    enabled: true,
                    reportSuites: ["ujslujslwaters"],
                  },
                  com_adobe_experience_platform: {
                    enabled: true,
                    datasets: {
                      event: [
                        {
                          datasetId: "5eb4502dd3903818a8d113f5",
                          primary: true,
                          xdmSchema:
                            "https://ns.adobe.com/unifiedjslab/schemas/96bb756ec16fac4d53de2018b2571da61721c7bfc14a3ed6",
                          flowId: "978715b4-972a-49bb-8eed-d90977451956",
                        },
                      ],
                    },
                  },
                  com_adobe_experience_platform_ode: {
                    enabled: false,
                    containerId: "94b98c41-6ec1-34c4-8d60-011c0e376833",
                  },
                  com_adobe_experience_platform_edge_segmentation: {
                    enabled: true,
                  },
                  com_adobe_experience_platform_edge_destinations: {
                    enabled: true,
                  },
                  com_adobe_experience_platform_ajo: {
                    enabled: true,
                    containerId: "94b98c41-6ec1-34c4-8d60-011c0e376833",
                  },
                },
              },
              orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
              sandboxName: "prod",
              _system: {
                id: "0a106b4d-1937-4196-a64d-4a324e972459",
                revision: 10,
                createdAt: "2022-06-15T20:28:15Z",
                createdBy: "waters@adobe.com",
                updatedAt: "2024-02-05T17:35:26Z",
                updatedBy: "EE-Gateway-Flow@AdobeID",
              },
              _links: {
                self: {
                  href: "/metadata/namespaces/edge/datasets/datastreams/records/0a106b4d-1937-4196-a64d-4a324e972459",
                },
              },
            },

            {
              data: {
                title: "analytics enabled ",
                enabled: true,
                description: "testing activity map",
                settings: {
                  input: {
                    schemaId:
                      "https://ns.adobe.com/unifiedjslab/schemas/95818596c23f70a51ae7e6dddf2a1eb6a203c0f1898cc12c",
                  },
                  geo_resolution: "none",
                  state: {
                    first_party_id: {
                      cookie: {
                        enabled: false,
                      },
                    },
                  },
                  com_adobe_identity: {
                    idSyncEnabled: false,
                  },
                  access_type: "mixed",
                  com_adobe_analytics: {
                    enabled: true,
                    reportSuites: ["ujslatest"],
                  },
                },
              },
              orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
              sandboxName: "prod",
              _system: {
                id: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
                revision: 4,
                createdAt: "2022-10-12T19:10:45Z",
                createdBy: "nciocanu@adobe.com",
                updatedAt: "2022-10-24T10:37:12Z",
                updatedBy: "exeg_config_service@AdobeID",
              },
              _links: {
                self: {
                  href: "/metadata/namespaces/edge/datasets/datastreams/records/2fdb3763-0507-42ea-8856-e91bf3b64faa",
                },
              },
            },

            {
              data: {
                title: "Analytics enabled",
                enabled: true,
                description: "to test activity map",
                settings: {
                  input: {
                    schemaId:
                      "https://ns.adobe.com/unifiedjslab/schemas/96bb756ec16fac4d53de2018b2571da61721c7bfc14a3ed6",
                  },
                  geo_resolution: "none",
                  state: {
                    first_party_id: {
                      cookie: {
                        enabled: false,
                      },
                    },
                  },
                  com_adobe_identity: {
                    idSyncEnabled: false,
                  },
                  access_type: "mixed",
                },
              },
              orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
              sandboxName: "prod",
              _system: {
                id: "77469821-5ead-4045-97b6-acfd889ded6b",
                revision: 3,
                createdAt: "2022-10-12T19:10:03Z",
                createdBy: "nciocanu@adobe.com",
                updatedAt: "2022-10-24T13:12:05Z",
                updatedBy: "exeg_config_service@AdobeID",
              },
              _links: {
                self: {
                  href: "/metadata/namespaces/edge/datasets/datastreams/records/77469821-5ead-4045-97b6-acfd889ded6b",
                },
              },
            },
          ],
        },
        _links: {
          self: {
            href: "/metadata/namespaces/edge/datasets/datastreams/records?limit=1000&orderby=title",
          },
        },
      });
    },
  ),

  http.get(
    "https://edge.adobe.io/metadata/namespaces/edge/datasets/datastreams/records/2fdb3763-0507-42ea-8856-e91bf3b64faa",
    async () => {
      return HttpResponse.json({
        data: {
          title: "analytics enabled ",
          enabled: true,
          description: "testing activity map",
          settings: {
            input: {
              schemaId:
                "https://ns.adobe.com/unifiedjslab/schemas/95818596c23f70a51ae7e6dddf2a1eb6a203c0f1898cc12c",
            },
            geo_resolution: "none",
            state: {
              first_party_id: {
                cookie: {
                  enabled: false,
                },
              },
            },
            com_adobe_identity: {
              idSyncEnabled: false,
            },
            access_type: "mixed",
            com_adobe_analytics: {
              enabled: true,
              reportSuites: ["ujslatest"],
            },
          },
        },
        orgId: "97D1F3F459CE0AD80A495CBE@AdobeOrg",
        sandboxName: "prod",
        _system: {
          id: "2fdb3763-0507-42ea-8856-e91bf3b64faa",
          revision: 4,
          createdAt: "2022-10-12T19:10:45Z",
          createdBy: "nciocanu@adobe.com",
          updatedAt: "2022-10-24T10:37:12Z",
          updatedBy: "exeg_config_service@AdobeID",
        },
        _links: {
          self: {
            href: "/metadata/namespaces/edge/datasets/datastreams/records/2fdb3763-0507-42ea-8856-e91bf3b64faa",
          },
        },
      });
    },
  ),
];
