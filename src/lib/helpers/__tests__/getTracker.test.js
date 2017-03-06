/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

var Promise = require('@adobe/reactor-turbine/lib/require')('@turbine/promise');
var getTrackerInjector = require('inject!../getTracker');

var getTrackerModule = function(mocks) {
  return getTrackerInjector(mocks || {});
};

describe('get tracker', function() {
  it('returns a promise', function() {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve('loaded'));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {};
      },
      './loadLibrary': loadLibrarySpy
    });

    var getTrackerPromise = getTracker();
    expect(getTrackerPromise.then).toEqual(jasmine.any(Function));
    expect(getTrackerPromise.catch).toEqual(jasmine.any(Function));
  });

  it('loads the library with the provided settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve('loaded'));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {
          prop: 1
        };
      },
      './loadLibrary': loadLibrarySpy
    });

    getTracker().then(function() {
      expect(loadLibrarySpy).toHaveBeenCalledWith({
        prop: 1
      });
      done();
    });
  });

  describe('when EU compliance is required', function() {
    it('does not load a library if EU compliance is not acknowledged', function(done) {
      var getTracker = getTrackerModule({
        '@turbine/get-extension-settings': function() {
          return {
            euComplianceEnabled: true
          };
        }
      });

      getTracker().catch(function(error) {
        expect(error).toBe('EU compliance was not acknowledged by the user.');
        done();
      });
    });

    it('does load a library if EU compliance is acknowledged by the user', function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve('loaded'));
      var cookieSpy = jasmine.createSpyObj('cookie', ['parse']);
      cookieSpy.parse.and.returnValue({
        'sat_track': 'true'
      });

      var getTracker = getTrackerModule({
        '@turbine/get-extension-settings': function() {
          return {
            euComplianceEnabled: true
          };
        },
        '@turbine/property-settings': {
          'euCookieName': 'sat_track'
        },
        '@turbine/cookie': cookieSpy,
        './loadLibrary': loadLibrarySpy
      });

      getTracker().then(function() {
        expect(loadLibrarySpy).toHaveBeenCalledWith({
          euComplianceEnabled: true
        });
        done();
      });
    });
  });

  it('adds VisitorID instance to the tracker when needed', function(done) {
    var mcidInstance = {};
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {};
      },
      '@turbine/get-shared-module': function() {
        return mcidInstance;
      },
      './loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.visitor).toBe(mcidInstance);
      done();
    });
  });

  describe('updates the version of the tracker', function() {
    it('when tracker property is found', function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve({
          version: '1.5.2'
        }));

      var getTracker = getTrackerModule({
        '@turbine/get-extension-settings': function() {
          return {};
        },
        './generateVersion': function() {
          return 'DEBA';
        },
        './loadLibrary': loadLibrarySpy
      });

      getTracker().then(function(tracker) {
        expect(tracker.version).toBe('1.5.2-DEBA');
        done();
      });
    });

    it('when tagContainerMarker property is found', function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve({
          tagContainerMarker: 'marker'
        }));

      var getTracker = getTrackerModule({
        '@turbine/get-extension-settings': function() {
          return {};
        },
        './generateVersion': function() {
          return 'DEBA';
        },
        './loadLibrary': loadLibrarySpy
      });

      getTracker().then(function(tracker) {
        expect(tracker.tagContainerMarker).toBe('DEBA');
        done();
      });
    });
  });

  it('applies the properties on the tracker', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {
          trackerProperties: {
            prop1: 'a'
          }
        };
      },
      './loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });

  it('calls custom setup before appying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {
          trackerProperties: {
            prop1: 'a'
          },
          customSetup: {
            loadPhase: 'beforeSettings',
            source: function(tracker) {
              tracker.prop1 = 'b';
            }
          }
        };
      },
      './loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });


  it('calls custom setup after applying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {
          trackerProperties: {
            prop1: 'a'
          },
          customSetup: {
            source: function(tracker) {
              tracker.prop1 = 'b';
            }
          }
        };
      },
      './loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('b');
      done();
    });
  });

  it('extends the tracker when augmenters are available', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({}));

    var getTracker = getTrackerModule({
      '@turbine/get-extension-settings': function() {
        return {};
      },
      './loadLibrary': loadLibrarySpy,
      '../helpers/augmenters': [function(tracker) {
        tracker.augmentedOnce = true;
        return Promise.resolve('now');
      }, function(tracker) {
        tracker.augmentedTwice = true;
        return Promise.resolve('now');
      }]
    });

    getTracker().then(function(tracker) {
      expect(tracker.augmentedOnce).toBe(true);
      expect(tracker.augmentedTwice).toBe(true);
      done();
    });
  });

});
