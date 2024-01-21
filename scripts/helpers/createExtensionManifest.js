/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * @typedef {object} ExtensionManifest
 * https://experienceleague.adobe.com/docs/experience-platform/tags/extension-dev/manifest.html?lang=en
 * @property {string} displayName
 * @property {string} name
 * @property {string} iconPath
 * @property {string} exchangeUrl
 * @property {string} platform
 * @property {string} version
 * @property {string} description
 * @property {string} author.name
 * @property {string} viewBasePath
 * @property {string} main
 * @property {object} configuration
 * @property {object[]} actions
 * @property {object[]} events
 * @property {object[]} dataElements
 * @typedef {Pick<ExtensionManifest, "version">} ExtensionManifestConfiguration
 */

/**
 * Create a slice of a JSON schema used to describe the edge overrides
 * configuration.
 * Works for both actions and extension configuration
 * @param {boolean} isAction
 * @returns {object}
 */
const createEdgeConfigOverridesSchema = isAction => {
  const configOverridesProps = {
    com_adobe_experience_platform: {
      type: "object",
      properties: {
        datasets: {
          type: "object",
          properties: {
            event: {
              type: "object",
              properties: {
                datasetId: {
                  type: "string"
                }
              },
              required: ["datasetId"]
            }
          },
          required: ["event"]
        }
      },
      required: ["datasets"]
    },
    com_adobe_analytics: {
      type: "object",
      properties: {
        reportSuites: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: ["reportSuites"]
    },
    com_adobe_identity: {
      type: "object",
      properties: {
        idSyncContainerId: {
          anyOf: [
            {
              type: "integer"
            },
            {
              type: "string"
            }
          ]
        }
      },
      required: ["idSyncContainerId"]
    },
    com_adobe_target: {
      type: "object",
      properties: {
        propertyToken: {
          type: "string"
        }
      },
      required: ["propertyToken"]
    }
  };
  const configOverridesWithDatastream = {
    ...configOverridesProps,
    sandbox: {
      type: "string",
      minLength: 1
    },
    datastreamId: {
      type: "string",
      minLength: 1
    },
    datastreamIdInputMethod: {
      type: "string",
      enum: ["freeform", "select"]
    }
  };
  return {
    type: "object",
    properties: {
      ...configOverridesProps,
      development: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...(isAction ? configOverridesWithDatastream : configOverridesProps)
        }
      },
      staging: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...(isAction ? configOverridesWithDatastream : configOverridesProps)
        }
      },
      production: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...(isAction ? configOverridesWithDatastream : configOverridesProps)
        }
      }
    }
  };
};

/**
 * Create a list of common transforms used to with edge config overrides.
 * Works for both actions and extension configuration.
 * @param {boolean} isAction
 * @returns {{ type: "remove", propertyPath: string }[]}
 */
const createEdgeConfigOverridesTransforms = isAction => {
  const prefix = isAction ? "" : "instances[].";
  return [
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.development.sandbox`
    },
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.staging.sandbox`
    },
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.production.sandbox`
    },
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.development.datastreamIdInputMethod`
    },
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.staging.datastreamIdInputMethod`
    },
    {
      type: "remove",
      propertyPath: `${prefix}edgeConfigOverrides.production.datastreamIdInputMethod`
    }
  ];
};

/**
 * Create the contents of the extension.json aka the extension definition.
 * @param {ExtensionManifestConfiguration} options
 * @returns {ExtensionManifest}
 */
const createExtensionManifest = ({ version }) => {
  const actionEdgeConfigOverridesSchema = createEdgeConfigOverridesSchema(true);
  const actionEdgeConfigOverridesTransforms = createEdgeConfigOverridesTransforms(
    true
  );
  /** @type {ExtensionManifest} */
  const extensionManifest = {
    version,
    displayName: "Adobe Experience Platform Web SDK",
    name: "adobe-alloy-nina",
    iconPath: "resources/images/icon.svg",
    exchangeUrl:
      "https://exchange.adobe.com/experiencecloud.details.106387.aep-web-sdk.html",
    platform: "web",
    description:
      "The Adobe Experience Platform Web SDK allows for streaming data into the platform, syncing identities, personalizing content, and more.",
    author: {
      name: "Adobe"
    },
    viewBasePath: "dist/view/",
    configuration: {
      viewPath: "configuration/configuration.html",
      schema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          instances: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  pattern: "\\D+"
                },
                edgeConfigId: {
                  type: "string",
                  minLength: 1
                },
                stagingEdgeConfigId: {
                  type: "string",
                  minLength: 1
                },
                developmentEdgeConfigId: {
                  type: "string",
                  minLength: 1
                },
                sandbox: {
                  type: "string",
                  minLength: 1
                },
                stagingSandbox: {
                  type: "string",
                  minLength: 1
                },
                developmentSandbox: {
                  type: "string",
                  minLength: 1
                },
                orgId: {
                  type: "string",
                  minLength: 1
                },
                edgeDomain: {
                  type: "string",
                  minLength: 1
                },
                edgeBasePath: {
                  type: "string",
                  minLength: 1
                },
                defaultConsent: {
                  anyOf: [
                    {
                      type: "string",
                      pattern: "^%[^%]+%$"
                    },
                    {
                      type: "string",
                      enum: ["in", "out", "pending"]
                    }
                  ]
                },
                idMigrationEnabled: {
                  type: "boolean"
                },
                thirdPartyCookiesEnabled: {
                  type: "boolean"
                },
                prehidingStyle: {
                  type: "string",
                  minLength: 1
                },
                targetMigrationEnabled: {
                  type: "boolean"
                },
                clickCollectionEnabled: {
                  type: "boolean"
                },
                downloadLinkQualifier: {
                  type: "string",
                  minLength: 1
                },
                context: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "web",
                      "device",
                      "environment",
                      "placeContext",
                      "highEntropyUserAgentHints"
                    ]
                  }
                },
                onBeforeEventSend: {
                  type: "string",
                  minLength: 1
                },
                onBeforeLinkClickSend: {
                  type: "string",
                  minLength: 1
                },
                edgeConfigOverrides: createEdgeConfigOverridesSchema(false),
                mediaCollection: {
                  type: "object",
                  properties: {
                    channel: {
                      type: "string"
                    },
                    playerName: {
                      type: "string"
                    },
                    version: {
                      type: "string"
                    },
                    mainPingInterval: {
                      type: "integer"
                    },
                    adPingInterval: {
                      type: "integer"
                    }
                  }
                },
                personalizationStorageEnabled: {
                  type: "boolean"
                }
              },
              required: ["edgeConfigId", "name"],
              additionalProperties: false
            }
          }
        },
        required: ["instances"],
        additionalProperties: false
      },
      transforms: [
        {
          type: "function",
          propertyPath: "instances[].onBeforeEventSend",
          parameters: ["content"]
        },
        {
          type: "function",
          propertyPath: "instances[].onBeforeLinkClickSend",
          parameters: ["content"]
        },
        {
          type: "remove",
          propertyPath: "instances[].edgeConfigInputMethod"
        },
        {
          type: "remove",
          propertyPath: "instances[].sandbox"
        },
        {
          type: "remove",
          propertyPath: "instances[].stagingSandbox"
        },
        {
          type: "remove",
          propertyPath: "instances[].developmentSandbox"
        },
        ...createEdgeConfigOverridesTransforms(false)
      ]
    },
    actions: [
      {
        displayName: "Reset event merge ID",
        name: "reset-event-merge-id",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            eventMergeId: {
              type: "string",
              pattern: "^%[^%]+%$"
            }
          },
          required: ["eventMergeId"],
          additionalProperties: false
        },
        libPath: "dist/lib/actions/resetEventMergeId/index.js",
        viewPath: "actions/resetEventMergeId.html"
      },
      {
        displayName: "Send event",
        name: "send-event",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            guidedEventsEnabled: {
              type: "boolean"
            },
            guidedEvent: {
              type: "string"
            },
            instanceName: {
              type: "string",
              minLength: 1
            },
            renderDecisions: {
              type: "boolean",
              minLength: 1
            },
            decisionScopes: {
              anyOf: [
                {
                  type: "array"
                },
                {
                  type: "string",
                  pattern: "^%[^%]+%$"
                }
              ]
            },
            personalization: {
              type: "object",
              properties: {
                decisionScopes: {
                  anyOf: [
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        minLength: 1
                      }
                    },
                    {
                      type: "string",
                      pattern: "^%[^%]+%$"
                    }
                  ]
                },
                surfaces: {
                  anyOf: [
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        minLength: 1
                      }
                    },
                    {
                      type: "string",
                      pattern: "^%[^%]+%$"
                    }
                  ]
                },
                sendDisplayEvent: {
                  type: "boolean"
                },
                includeRenderedPropositions: {
                  type: "boolean"
                },
                defaultPersonalizationEnabled: {
                  type: "boolean"
                },
                decisionContext: {
                  anyOf: [
                    {
                      type: "string",
                      pattern: "^%[^%]+%$"
                    },
                    {
                      type: "object",
                      additionalProperties: {
                        type: "string"
                      }
                    }
                  ]
                }
              },
              additionalProperties: false
            },
            xdm: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            data: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            type: {
              type: "string",
              minLength: 1
            },
            mergeId: {
              type: "string",
              minLength: 1
            },
            datasetId: {
              type: "string",
              minLength: 1
            },
            documentUnloading: {
              type: "boolean"
            },
            edgeConfigOverrides: actionEdgeConfigOverridesSchema
          },
          required: ["instanceName"],
          additionalProperties: false
        },
        transforms: [
          {
            type: "remove",
            propertyPath: "guidedEventsEnabled"
          },
          {
            type: "remove",
            propertyPath: "guidedEvent"
          },
          ...actionEdgeConfigOverridesTransforms
        ],
        libPath: "dist/lib/actions/sendEvent/index.js",
        viewPath: "actions/sendEvent.html"
      },
      {
        displayName: "Set consent",
        name: "set-consent",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            identityMap: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            consent: {
              anyOf: [
                {
                  type: "array",
                  minItems: 1,
                  items: {
                    anyOf: [
                      {
                        type: "object",
                        properties: {
                          standard: {
                            type: "string",
                            enum: ["Adobe"]
                          },
                          version: {
                            type: "string"
                          },
                          value: {
                            type: "object",
                            properties: {
                              general: {
                                oneOf: [
                                  {
                                    type: "string",
                                    enum: ["in", "out"]
                                  },
                                  {
                                    type: "string",
                                    pattern: "^%[^%]+%$"
                                  }
                                ]
                              }
                            }
                          }
                        },
                        additionalProperties: false
                      },
                      {
                        type: "object",
                        properties: {
                          standard: {
                            type: "string",
                            enum: ["Adobe"]
                          },
                          version: {
                            type: "string"
                          },
                          value: {
                            type: "string",
                            pattern: "^%[^%]+%$"
                          }
                        }
                      },
                      {
                        type: "object",
                        properties: {
                          standard: {
                            type: "string",
                            enum: ["IAB TCF"]
                          },
                          version: {
                            type: "string"
                          },
                          value: {
                            type: "string"
                          },
                          gdprApplies: {
                            anyOf: [
                              {
                                type: "boolean"
                              },
                              {
                                type: "string",
                                pattern: "^%[^%]+%$"
                              }
                            ]
                          },
                          gdprContainsPersonalData: {
                            anyOf: [
                              {
                                type: "boolean"
                              },
                              {
                                type: "string",
                                pattern: "^%[^%]+%$"
                              }
                            ]
                          }
                        },
                        additionalProperties: false
                      }
                    ]
                  }
                },
                {
                  type: "string",
                  pattern: "^%[^%]+%$"
                }
              ]
            },
            edgeConfigOverrides: actionEdgeConfigOverridesSchema
          },
          required: ["instanceName", "consent"],
          additionalProperties: false
        },
        transforms: [...actionEdgeConfigOverridesTransforms],
        libPath: "dist/lib/actions/setConsent/index.js",
        viewPath: "actions/setConsent.html"
      },
      {
        displayName: "Redirect with identity",
        name: "redirect-with-identity",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            edgeConfigOverrides: actionEdgeConfigOverridesSchema
          },
          required: ["instanceName"],
          additionalProperties: false
        },
        transforms: [...actionEdgeConfigOverridesTransforms],
        libPath: "dist/lib/actions/redirectWithIdentity/index.js",
        viewPath: "actions/redirectWithIdentity.html"
      },
      {
        displayName: "Apply response",
        name: "apply-response",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            renderDecisions: {
              type: "boolean",
              minLength: 1
            },
            responseHeaders: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            responseBody: {
              type: "string",
              pattern: "^%[^%]+%$"
            }
          },
          required: ["instanceName", "responseBody"],
          additionalProperties: false
        },
        libPath: "dist/lib/actions/applyResponse/index.js",
        viewPath: "actions/applyResponse.html"
      },
      {
        displayName: "Apply propositions",
        name: "apply-propositions",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            propositions: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            metadata: {
              anyOf: [
                {
                  type: "string",
                  pattern: "^%[^%]+%$"
                },
                {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                    properties: {
                      selector: {
                        type: "string",
                        minLength: 1
                      },
                      actionType: {
                        type: "string",
                        enum: ["setHtml", "replaceHtml", "appendHtml"]
                      }
                    },
                    required: ["selector", "actionType"]
                  }
                }
              ]
            },
            viewName: {
              type: "string",
              minLength: 1
            }
          }
        },
        libPath: "dist/lib/actions/applyPropositions/index.js",
        viewPath: "actions/applyPropositions.html"
      },
      {
        displayName: "Update variable",
        name: "update-variable",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            dataElementCacheId: {
              type: "string",
              minLength: 1
            },
            dataElementId: {
              type: "string",
              minLength: 1
            },
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  minLength: 1
                },
                version: {
                  type: "string",
                  minLength: 1
                }
              },
              required: ["id", "version"],
              additionalProperties: false
            },
            data: {
              anyOf: [
                {
                  type: "object"
                },
                {
                  type: "string",
                  minLength: 1
                }
              ]
            },
            transforms: {
              type: "object"
            }
          },
          required: ["dataElementCacheId", "dataElementId"]
        },
        transforms: [
          {
            type: "remove",
            propertyPath: "dataElementId"
          },
          {
            type: "remove",
            propertyPath: "schema"
          }
        ],
        libPath: "dist/lib/actions/updateVariable/index.js",
        viewPath: "actions/updateVariable.html"
      },
      {
        displayName: "Create Media Session",
        name: "create-media-session",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            xdm: {
              type: "string",
              pattern: "^%[^%]+%$"
            },
            playerId: {
              type: "string"
            },
            onBeforeMediaEvent: {
              type: "string"
            }
          },
          required: ["instanceName"],
          additionalProperties: false
        },
        libPath: "dist/lib/actions/createMediaSession/index.js",
        viewPath: "actions/createMediaSession.html",
        transforms: [
          {
            type: "function",
            propertyPath: "onBeforeMediaEvent",
            parameters: ["content"]
          }
        ]
      },
      {
        displayName: "Send Media Event",
        name: "send-media-event",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            eventType: {
              type: "string",
              minLength: 1
            },
            playerId: {
              type: "string",
              minLength: 1
            },
            xdm: {
              type: "object"
            }
          },
          required: ["instanceName"]
        },
        libPath: "dist/lib/actions/sendMediaEvent/index.js",
        viewPath: "actions/sendMediaAnalyticsEvent.html"
      },
      {
        displayName: "Get Media Tracker API",
        name: "get-media-tracker-api",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            instanceName: {
              type: "string",
              minLength: 1
            },
            objectName: {
              type: "string",
              minLength: 1
            }
          },
          required: ["instanceName"]
        },
        libPath: "dist/lib/actions/getMediaTrackerAPI/index.js",
        viewPath: "actions/createMediaTracker.html"
      },
      {
        displayName: "Evaluate rulesets",
        name: "evaluate-rulesets",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          instanceName: {
            type: "string",
            minLength: 1
          },
          renderDecisions: {
            type: "boolean"
          },
          personalization: {
            type: "object",
            properties: {
              decisionContext: {
                anyOf: [
                  {
                    type: "string",
                    pattern: "^%[^%]+%$"
                  },
                  {
                    type: "object",
                    additionalProperties: {
                      type: "string"
                    }
                  }
                ]
              }
            }
          }
        },
        libPath: "dist/lib/actions/evaluateRulesets/index.js",
        viewPath: "actions/evaluateRulesets.html"
      }
    ],
    events: [
      {
        name: "decisions-received",
        displayName: "Decisions received (DEPRECATED)",
        libPath: "dist/lib/events/decisionsReceived/index.js",
        schema: {}
      },
      {
        name: "send-event-complete",
        displayName: "Send event complete",
        libPath: "dist/lib/events/sendEventComplete/index.js",
        schema: {}
      },
      {
        name: "subscribe-ruleset-items",
        displayName: "Subscribe ruleset items",
        libPath: "dist/lib/events/subscribeRulesetItems/index.js",
        viewPath: "events/subscribeRulesetItems.html",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          instanceName: {
            type: "string",
            minLength: 1
          },
          surfaces: {
            anyOf: [
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  minLength: 1
                }
              },
              {
                type: "string",
                pattern: "^%[^%]+%$"
              }
            ]
          },
          schemas: {
            anyOf: [
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  minLength: 1
                }
              },
              {
                type: "string",
                pattern: "^%[^%]+%$"
              }
            ]
          }
        }
      },
      {
        name: "media-session-id-received",
        displayName: "Media Analytics Session ID received",
        libPath:
          "dist/lib/events/createMediaAnalyticsSessionIDComplete/index.js",
        schema: {}
      }
    ],
    dataElements: [
      {
        displayName: "Event merge ID",
        name: "event-merge-id",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            cacheId: {
              type: "string",
              minLength: 1
            }
          },
          required: ["cacheId"],
          additionalProperties: false
        },
        libPath: "dist/lib/dataElements/eventMergeId/index.js",
        viewPath: "dataElements/eventMergeId.html"
      },
      {
        displayName: "Identity map",
        name: "identity-map",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          additionalProperties: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                },
                authenticatedState: {
                  type: "string",
                  enum: ["loggedOut", "authenticated", "ambiguous"]
                },
                primary: {
                  type: "boolean"
                }
              },
              additionalProperties: false
            }
          }
        },
        libPath: "dist/lib/dataElements/identityMap/index.js",
        viewPath: "dataElements/identityMap.html"
      },
      {
        displayName: "XDM object",
        name: "xdm-object",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            sandbox: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 1
                }
              },
              required: ["name"],
              additionalProperties: false
            },
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  minLength: 1
                },
                version: {
                  type: "string",
                  minLength: 1
                }
              },
              required: ["id", "version"],
              additionalProperties: false
            },
            data: {
              type: "object"
            }
          },
          required: ["schema", "data"],
          additionalProperties: false
        },
        transforms: [
          {
            type: "remove",
            propertyPath: "schema"
          }
        ],
        libPath: "dist/lib/dataElements/xdmObject/index.js",
        viewPath: "dataElements/xdmObject.html"
      },
      {
        displayName: "Variable",
        name: "variable",
        schema: {
          $schema: "http://json-schema.org/draft-04/schema#",
          type: "object",
          properties: {
            cacheId: {
              type: "string",
              minLength: 1
            },
            sandbox: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 1
                }
              },
              required: ["name"],
              additionalProperties: false
            },
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  minLength: 1
                },
                version: {
                  type: "string",
                  minLength: 1
                }
              },
              required: ["id", "version"],
              additionalProperties: false
            }
          },
          required: ["cacheId"],
          additionalProperties: false
        },
        transforms: [
          {
            type: "remove",
            propertyPath: "schema"
          },
          {
            type: "remove",
            propertyPath: "sandbox"
          }
        ],
        libPath: "dist/lib/dataElements/variable/index.js",
        viewPath: "dataElements/variable.html"
      }
    ],
    main: "dist/lib/instanceManager/index.js"
  };

  return extensionManifest;
};

module.exports = createExtensionManifest;
