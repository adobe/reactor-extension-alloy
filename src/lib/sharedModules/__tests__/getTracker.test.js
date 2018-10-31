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

var Promise = require('@adobe/reactor-promise');
var getTrackerInjector = require('inject!../getTracker');

var getTrackerModule = function(mocks) {
  mocks = mocks || {};
  mocks['@adobe/reactor-load-script'] = mocks['@adobe/reactor-load-script'] ||
    function(url) {
      return Promise.resolve();
    };
  return getTrackerInjector(mocks);
};

var getMockTrackerObj = function() {
  return {
    loadModule: function(moduleName) {},
    AudienceManagement: {
      setup: function() {}
    }
  };
};

var mockTurbine;

describe('get tracker', function() {

  beforeEach(function() {
    mockTurbine = {
      buildInfo: {
        turbineBuildDate: '2016-07-01T18:10:34Z'
      },
      getHostedLibFileUrl: function(file) {
        return '//example.com/' + file;
      },
      propertySettings: {
        trackingCookieName: 'sat_track'
      },
      getSharedModule: function() {
        return {};
      },
      getExtensionSettings: function() {
        return {};
      },
      logger: jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log'])
    };

    mockTurbineVariable(mockTurbine);
  });

  afterEach(function() {
    resetTurbineVariable();
  });

  it('returns a promise', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
    });

    var getTrackerPromise = getTracker();
    expect(getTrackerPromise.then).toEqual(jasmine.any(Function));
    expect(getTrackerPromise.catch).toEqual(jasmine.any(Function));

    // We need to wait until the promise is resolved to end the test, otherwise stuff that
    // asynchronously happens within getTracker will attempt to access our mock turbine object
    // which would have since been made unavailable.
    getTrackerPromise.then(function() {
      done();
    });
  });

  it('loads the library with the provided settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    mockTurbine.getExtensionSettings = function() {
      return {
        prop: 1
      };
    };

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
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

      mockTurbine.getExtensionSettings = function() {
        return {
          trackingCookieName: 'x'
        };
      };

      var getTracker = getTrackerModule();

      getTracker().catch(function(error) {
        expect(error).toBe('EU compliance was not acknowledged by the user.');
        done();
      });
    });

    it('does load a library if EU compliance is acknowledged by the user', function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve(getMockTrackerObj()));
      var cookieSpy = jasmine.createSpyObj('cookie', ['get']);
      cookieSpy.get.and.returnValue('true');

      mockTurbine.getExtensionSettings = function() {
        return {
          trackingCookieName: 'x'
        };
      };

      var getTracker = getTrackerModule({
        '@adobe/reactor-cookie': cookieSpy,
        '../helpers/loadLibrary': loadLibrarySpy
      });

      getTracker().then(function() {
        expect(loadLibrarySpy).toHaveBeenCalledWith({
          trackingCookieName: 'x'
        });
        done();
      });
    });
  });

  it('adds VisitorID instance to the tracker when needed', function(done) {
    var mcidInstance = {};
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    mockTurbine.getSharedModule = function() {
      return mcidInstance;
    };

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.visitor).toBe(mcidInstance);
      done();
    });
  });

  describe('updates the version of the tracker', function() {
    it('when tracker property is found', function(done) {
      var mockTracker = getMockTrackerObj();
      mockTracker.version = '1.5.2';
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve(mockTracker));

      var getTracker = getTrackerModule({
        '../helpers/generateVersion': function() {
          return 'DEBA';
        },
        '../helpers/loadLibrary': loadLibrarySpy
      });

      getTracker().then(function(tracker) {
        expect(tracker.version).toBe('1.5.2-DEBA');
        done();
      });
    });

    it('when tagContainerMarker property is found', function(done) {
      var mockTracker = getMockTrackerObj();
      mockTracker.tagContainerMarker = 'marker';
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve(mockTracker));

      var getTracker = getTrackerModule({
        '../helpers/generateVersion': function() {
          return 'DEBA';
        },
        '../helpers/loadLibrary': loadLibrarySpy
      });

      getTracker().then(function(tracker) {
        expect(tracker.tagContainerMarker).toBe('DEBA');
        done();
      });
    });
  });

  it('applies the properties on the tracker', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    mockTurbine.getExtensionSettings = function() {
      return {
        trackerProperties: {
          prop1: 'a'
        }
      };
    };

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });

  it('calls custom setup before appying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    mockTurbine.getExtensionSettings = function() {
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
    };

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });


  it('calls custom setup after applying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    mockTurbine.getExtensionSettings = function() {
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
    };

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy
    });

    getTracker().then(function(tracker) {
      expect(tracker.prop1).toBe('b');
      done();
    });
  });

  it('extends the tracker when augmenters that return promises are available', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve(getMockTrackerObj()));

    var getTracker = getTrackerModule({
      '../helpers/loadLibrary': loadLibrarySpy,
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

  it('extends the tracker when augmenters that do not return promises are available',
    function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve(getMockTrackerObj()));

      var getTracker = getTrackerModule({
        '../helpers/loadLibrary': loadLibrarySpy,
        '../helpers/augmenters': [function(tracker) {
          tracker.augmentedOnce = true;
        }, function(tracker) {
          tracker.augmentedTwice = true;
        }]
      });

      getTracker().then(function(tracker) {
        expect(tracker.augmentedOnce).toBe(true);
        expect(tracker.augmentedTwice).toBe(true);
        done();
      });
    });

  it('still resolves with a tracker when augmenters throw errors',
    function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve(getMockTrackerObj()));

      var getTracker = getTrackerModule({
        '../helpers/loadLibrary': loadLibrarySpy,
        '../helpers/augmenters': [function() {
          throw new Error('error thrown from augmenter');
        }, function(tracker) {
          tracker.augmentedTwice = true;
        }]
      });

      // The error from the augmenter is re-thrown asynchronously so we have to catch it at window.
      var errorFromAugmenter;
      window.onerror = function(err) {
        errorFromAugmenter = err;
        return true;
      };

      var trackerPromise = getTracker();
      trackerPromise.then(function(tracker) {
        expect(tracker.augmentedOnce).toBe(undefined);
        expect(tracker.augmentedTwice).toBe(true);

        // The error from the augmenter is re-thrown asynchronously.
        // I struggle to get this test to always pass in IE9 without a timeout of 10 or greater.
        // The jasmine mock clock failed me as well. If this give us problems, we may need
        // to give more attention to it later.
        setTimeout(function() {
          expect(errorFromAugmenter).toBeDefined();
          expect(errorFromAugmenter).toContain('error thrown from augmenter');
          window.onerror = null;
          done();
        }, 10);
      });
    });
});
