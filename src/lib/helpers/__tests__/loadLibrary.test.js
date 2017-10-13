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
var loadLibraryInjector = require('inject!../loadLibrary');

var getLoadLibrary = function(mocks) {
  mocks = mocks || {};

  mocks['@adobe/reactor-window'] = mocks['@adobe/reactor-window'] ||
    {
      'AppMeasurement':  function() {}
    };

  mocks['@adobe/reactor-load-script'] = mocks['@adobe/reactor-load-script'] ||
    function() {};

  return loadLibraryInjector(mocks);
};

var mockTurbine;

describe('load library', function() {
  beforeAll(function() {
    mockTurbine = {
      logger: jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']),
      onPageBottom: jasmine.createSpy('on-page-bottom').and.callFake(function(callback) {
        callback();
      }),
      getHostedLibFileUrl: function(file) { return '//example.com/' + file; },
      buildInfo: {
        environment: 'development'
      }
    };
    mockTurbineVariable(mockTurbine);
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  it('throws an error for unknown type', function() {
    var loadLibrary = getLoadLibrary();

    var fn = function() {
      loadLibrary({
        libraryCode: {
          type: 'some'
        }
      });
    };

    expect(fn).toThrow();
  });

  describe('for managed type', function() {
    it('loads script from url', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads library at page top', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          loadPhase: 'pageTop',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads library at page bottom', function(done) {
      var loadLibrary = getLoadLibrary({});

      loadLibrary({
        libraryCode: {
          type: 'managed',
          loadPhase: 'pageBottom',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(mockTurbine.onPageBottom).toHaveBeenCalled();
        done();
      });
    });

    it('calls window.AppMeasurement to initialize the library', function(done) {
      var AppMeasuremenTrackerSpy = jasmine.createSpyObj('AppMeasurement', ['sa']);
      var windowSpy = {
        AppMeasurement: function() {
          return AppMeasuremenTrackerSpy;
        }
      };

      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(AppMeasuremenTrackerSpy.sa).toHaveBeenCalledWith('aa');
        done();
      });
    });

    it('throws an error if window.AppMeasurement is not defined', function(done) {
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': {}
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).catch(function(e) {
        expect(e).toEqual(jasmine.stringMatching('`AppMeasurement` method not found.'));
        done();
      });
    });

    it('calls window.AppMeasurement with specified build info environment report suites to ' +
      'initialize the library', function(done) {
      var AppMeasuremenTrackerSpy = jasmine.createSpyObj('AppMeasurement', ['sa']);
      var windowSpy = {
        AppMeasurement: function() {
          return AppMeasuremenTrackerSpy;
        }
      };

      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa'],
            development: ['bb']
          }
        }
      }).then(function() {
        expect(AppMeasuremenTrackerSpy.sa).toHaveBeenCalledWith('bb');
        done();
      });
    });

    it('loads managed script only once', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script')
        .and.returnValue(Promise.resolve('loaded'));
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        loadLibrary({
          libraryCode: {
            type: 'managed',
            accounts: {
              production: ['aa']
            }
          }
        }).then(function() {
          expect(loadScriptSpy.calls.count()).toEqual(1);
          done();
        });
      });
    });
  });

  describe('for preinstalled type', function() {
    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('does a polling for detecting the app measurement', function(done) {
      var windowSpy = {};
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'preinstalled',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function(s) {
        expect(s).toBe(windowSpy['s']);
        done();
      });

      windowSpy['s'] = jasmine.createSpy('s');
      jasmine.clock().tick(1001);
    });

    it('throws an error if tracker is not found in a 10s interval', function(done) {
      var windowSpy = {};
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'preinstalled',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).catch(function(e) {
        expect(e).toEqual(jasmine.stringMatching('Bailing out'));
        done();
      });

      jasmine.clock().tick(10001);
    });

    it('calls set account method from tracker', function(done) {
      var windowSpy = {};
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'preinstalled',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function(s) {
        expect(windowSpy.s.sa).toHaveBeenCalledWith('aa');
        done();
      });

      windowSpy['s'] = jasmine.createSpyObj('s', ['sa']);
      jasmine.clock().tick(1001);
    });
  });

  describe('for custom type', function() {
    it('loads script from url', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy,
        '@adobe/reactor-window': {
          's': function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'custom',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads library at page top', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy,
        '@adobe/reactor-window': {
          's': function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'custom',
          loadPhase: 'pageTop',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads library at page bottom', function(done) {
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': {
          's': function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'custom',
          loadPhase: 'pageBottom',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(mockTurbine.onPageBottom).toHaveBeenCalled();
        done();
      });
    });

    it('throws an error if tracker is not found at the specified varible', function(done) {
      var loadLibrary = getLoadLibrary();

      loadLibrary({
        libraryCode: {
          type: 'custom',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).catch(function(e) {
        expect(e).toEqual(jasmine.stringMatching('Cannot find the global variable name'));
        done();
      });
    });

    it('calls set account method from tracker', function(done) {
      var windowSpy = {
        b: jasmine.createSpyObj('b', ['sa'])
      };
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'custom',
          trackerVariableName: 'b',
          accounts: {
            production: ['cc']
          }
        }
      }).then(function() {
        expect(windowSpy.b.sa).toHaveBeenCalledWith('cc');
        done();
      });
    });
  });

  describe('for remote type', function() {
    it('loads script from url', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy,
        '@adobe/reactor-window': {
          location: {
            protocol: 'http:'
          },
          s: function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads htpps script from url', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy,
        '@adobe/reactor-window': {
          location: {
            protocol: 'https:'
          },
          s: function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          trackerVariableName: 's',
          httpsUrl: 'https://someurl.com',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy.calls.mostRecent().args[0]).toBe('https://someurl.com');
        done();
      });
    });

    it('loads library at page top', function(done) {
      var loadScriptSpy = jasmine.createSpy('load-script');
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-load-script': loadScriptSpy,
        '@adobe/reactor-window': {
          location: {
            protocol: 'http:'
          },
          s: function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          loadPhase: 'pageTop',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(loadScriptSpy).toHaveBeenCalled();
        done();
      });
    });

    it('loads library at page bottom', function(done) {
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': {
          location: {
            protocol: 'http:'
          },
          s: function() {}
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          loadPhase: 'pageBottom',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(mockTurbine.onPageBottom).toHaveBeenCalled();
        done();
      });
    });

    it('throws an error if tracker is not found at the specified varible', function(done) {
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': {
          location: {
            protocol: 'http:'
          }
        }
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          trackerVariableName: 's',
          accounts: {
            production: ['aa']
          }
        }
      }).catch(function(e) {
        expect(e).toEqual(jasmine.stringMatching('Cannot find the global variable name'));
        done();
      });
    });

    it('calls set account method from tracker', function(done) {
      var windowSpy = {
        b: jasmine.createSpyObj('b', ['sa']),
        location: {
          protocol: 'http:'
        }
      };
      var loadLibrary = getLoadLibrary({
        '@adobe/reactor-window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'remote',
          trackerVariableName: 'b',
          accounts: {
            production: ['cc']
          }
        }
      }).then(function() {
        expect(windowSpy.b.sa).toHaveBeenCalledWith('cc');
        done();
      });
    });
  });
});
