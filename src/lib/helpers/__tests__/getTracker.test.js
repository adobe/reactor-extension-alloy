'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');
var Promise = publicRequire('promise');
var getTrackerInjector = require('inject!../getTracker');
var applyTrackerVariablesInjector = require('inject!../applyTrackerVariables');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getTrackerModule = function(mocks) {
  return getTrackerInjector({
    'promise': Promise,
    'logger': (mocks && mocks.logger) || getLoggerMockObject(),
    'cookie': (mocks && mocks['cookie']) || publicRequire('cookie'),
    'get-shared-module': (mocks && mocks['get-shared-module']) || function() {},
    'get-extension-configurations': mocks['get-extension-configurations'],
    './loadLibrary.js': (mocks && mocks['./loadLibrary.js']) || function() {
      return Promise.resolve('library');
    },
    './versionGenerator.js': (mocks && mocks['./generateVersion.js']) || function() {},
    './applyTrackerVariables.js': applyTrackerVariablesInjector({
      'logger': getLoggerMockObject()
    }),
    'build-info': (mocks && mocks['build-info']) || {
      'turbineBuildDate': '2016-07-01T18:10:34Z'
    },
    'property-settings': (mocks && mocks['property-settings']) || {}
  });
};

describe('get tracker', function() {
  it('returns a promise', function() {
    var getTracker = getTrackerModule({
      'get-extension-configurations': function() {
        return {
          EC1: {}
        };
      }
    });

    var getTrackerPromise = getTracker('EC1');
    expect(getTrackerPromise.then).toEqual(jasmine.any(Function));
    expect(getTrackerPromise.catch).toEqual(jasmine.any(Function));
  });

  it('loads the library for a configuration', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve('loaded'));

    var getTracker = getTrackerModule({
      'get-extension-configurations': function() {
        return {
          EC1: {
            prop: 1
          }
        };
      },
      './loadLibrary.js': loadLibrarySpy
    });

    getTracker('EC1').then(function() {
      expect(loadLibrarySpy).toHaveBeenCalledWith({
        prop: 1
      });
      done();
    });
  });

  describe('when EU compliance is required', function() {
    it('does not load a library if EU compliance is not acknowledged', function(done) {
      var getTracker = getTrackerModule({
        'get-extension-configurations': function() {
          return {
            EC1: {
              euComplianceEnabled: true
            }
          };
        }
      });

      getTracker('EC1').catch(function(error) {
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
        'get-extension-configurations': function() {
          return {
            EC1: {
              euComplianceEnabled: true
            }
          };
        },
        'cookie': cookieSpy,
        './loadLibrary.js': loadLibrarySpy
      });

      getTracker('EC1').then(function() {
        expect(loadLibrarySpy).toHaveBeenCalledWith({
          euComplianceEnabled: true
        });
        done();
      });
    });

    it('does load a library if EU compliance is acknowledged by the user when cookie name is not ' +
      'the default one', function(done) {
      var loadLibrarySpy = jasmine.createSpy('load-library')
        .and.returnValue(Promise.resolve('loaded'));
      var cookieSpy = jasmine.createSpyObj('cookie', ['parse']);
      cookieSpy.parse.and.returnValue({
        'somename': 'true'
      });

      var getTracker = getTrackerModule({
        'get-extension-configurations': function() {
          return {
            EC1: {
              euComplianceEnabled: true
            }
          };
        },
        'property-settings': {
          euCookieName: 'somename'
        },
        'cookie': cookieSpy,
        './loadLibrary.js': loadLibrarySpy
      });

      getTracker('EC1').then(function() {
        expect(loadLibrarySpy).toHaveBeenCalledWith({
          euComplianceEnabled: true
        });
        done();
      });
    });
  });

  it('adds VisitorID instance to the tracker when needed', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      'get-extension-configurations': function() {
        return {
          EC1: {}
        };
      },
      'get-shared-module': function() {
        return function() {
          return Promise.resolve('visitor id instance');
        };
      },
      './loadLibrary.js': loadLibrarySpy
    });

    getTracker('EC1').then(function(tracker) {
      expect(tracker.visitor).toBe('visitor id instance');
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
        'get-extension-configurations': function() {
          return {
            EC1: {}
          };
        },
        './versionGenerator.js': function() {
          return 'DEBA';
        },
        './loadLibrary.js': loadLibrarySpy
      });

      getTracker('EC1').then(function(tracker) {
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
        'get-extension-configurations': function() {
          return {
            EC1: {}
          };
        },
        './versionGenerator.js': function() {
          return 'DEBA';
        },
        './loadLibrary.js': loadLibrarySpy
      });

      getTracker('EC1').then(function(tracker) {
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
      'get-extension-configurations': function() {
        return {
          EC1: {
            trackerProperties: {
              prop1: 'a'
            }
          }
        };
      },
      './loadLibrary.js': loadLibrarySpy
    });

    getTracker('EC1').then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });

  it('calls custom setup before appying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      'get-extension-configurations': function() {
        return {
          EC1: {
            trackerProperties: {
              prop1: 'a'
            },
            customSetup: {
              loadPhase: 'beforeSettings',
              source: function(e, tracker) {
                tracker.prop1 = 'b';
              }
            }
          }
        };
      },
      './loadLibrary.js': loadLibrarySpy
    });

    getTracker('EC1').then(function(tracker) {
      expect(tracker.prop1).toBe('a');
      done();
    });
  });


  it('calls custom setup after appying settings', function(done) {
    var loadLibrarySpy = jasmine.createSpy('load-library')
      .and.returnValue(Promise.resolve({
      }));

    var getTracker = getTrackerModule({
      'get-extension-configurations': function() {
        return {
          EC1: {
            trackerProperties: {
              prop1: 'a'
            },
            customSetup: {
              source: function(e, tracker) {
                tracker.prop1 = 'b';
              }
            }
          }
        };
      },
      './loadLibrary.js': loadLibrarySpy
    });

    getTracker('EC1').then(function(tracker) {
      expect(tracker.prop1).toBe('b');
      done();
    });
  });
});
