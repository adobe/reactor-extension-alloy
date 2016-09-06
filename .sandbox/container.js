'use strict';

module.exports = {
  rules: [
    {
      name: 'Page beacon',
      events: [
        {
          modulePath: 'dtm/src/lib/events/pageBottom.js',
          settings: {}
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'adobe-analytics/src/lib/actions/sendBeacon.js',
          settings: {
            "type": "page"
          }
        }
      ]
    }
  ],
  dataElements: {},
  extensions: {
    "adobe-mcid": {
      displayName: 'Adobe MCID',
      configurations: {
        ECx: {
          settings: {
            "mcOrgId": "93B41AC151F037F00A490D4D@AdobeOrg"
          }
        }
      }
    },
    "adobe-analytics": {
      displayName: 'Adobe Analytics',
      configurations: {
        ECa: {
          settings: {
            "libraryCode": {
              "type": "managed",
              "accounts": {
                "production": [
                  "Reports"
                ]
              },
              "loadPhase": "pageBottom"
            },
            "trackerProperties": {
              "trackInlineStats": true,
              "trackDownloadLinks": true,
              "trackExternalLinks": true,
              "linkDownloadFileTypes": [
                "doc",
                "docx"
              ],
              "linkInternalFilters": [
                "javascript:",
                "tel:",
                "mailto:"
              ]
            }
          }
        },
        ECb: {
          settings: {
            "libraryCode": {
              "type": "managed",
              "accounts": {
                "production": [
                  "Reports2"
                ]
              },
              "loadPhase": "pageBottom"
            }
          }
        }
      },
      // This will be populated automatically based on features found in extension.json.
      modules: {}
    }
  },
  propertySettings: {},
  buildInfo: {
    turbineVersion: '14.0.0',
    turbineBuildDate: '2016-07-01T18:18:34Z',
    buildDate: '2016-07-01T18:18:34Z',
    environment: 'development'
  }
};
