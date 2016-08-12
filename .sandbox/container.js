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
    appVersion: '52A',
    buildDate: '2015-03-16 20:55:42 UTC',
    publishDate: '2015-03-16 14:43:44 -0600',
    environment: 'development'
  }
};
