'use strict';

module.exports = {
  rules: [
    {
      name: 'Page beacon',
      events: [
        {
          modulePath: 'sandbox/pageTop.js',
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
      settings: {
        "orgId": "93B41AC151F037F00A490D4D@AdobeOrg"
      }
    },
    "adobe-analytics": {
      displayName: 'Adobe Analytics',
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
      },
      // This will be populated automatically based on features found in extension.json.
      modules: {}
    },
    "other-extension": {
      displayName: "Some other extension",
      "modules": {
        "other-extension/src/a.js": {
          "script": function(module, exports, require, turbine) {
            var augmentTracker = turbine.getSharedModule('adobe-analytics', 'augment-tracker');
            augmentTracker(function(tracker) {
              return new Promise(function(resolve) {
                tracker.augmented = true;
                console.log('Augmented');
                setTimeout(resolve, 1000);
              });
            });
          }
        }
      }
    }
  },
  property: {
    name: 'Sandbox property',
    settings: {
      domains: [
        'adobe.com',
        'example.com'
      ],
      linkDelay: 100,
      euCookieName: 'sat_track',
      undefinedVarsReturnEmpty: false
    }
  },
  buildInfo: {
    turbineVersion: '14.0.0',
    turbineBuildDate: '2016-07-01T18:18:34Z',
    buildDate: '2016-07-01T18:18:34Z',
    environment: 'development'
  }
};
