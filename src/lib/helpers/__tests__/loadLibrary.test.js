'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');
var Promise = publicRequire('promise');
var loadLibraryInjector = require('inject!../loadLibrary');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getLoadLibrary = function(mocks) {
  return loadLibraryInjector({
    'build-info': (mocks && mocks['build-info']) || {
      'environment': 'production'
    },
    'logger': (mocks && mocks.logger) || getLoggerMockObject(),
    'load-script': (mocks && mocks['load-script']) || function() {},
    'promise': Promise,
    'window': (mocks && mocks['window']) || {
      's_gi':  function() {}
    },
    'on-page-bottom': (mocks && mocks['on-page-bottom']) || function(callback) { callback() }
  });
};

describe('load library', function() {
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
        'load-script': loadScriptSpy
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
        'load-script': loadScriptSpy
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
      var onPageBottomSpy = jasmine.createSpy('on-page-bottom').and.callFake(function(callback) {
        callback();
      });

      var loadLibrary = getLoadLibrary({
        'on-page-bottom': onPageBottomSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          loadPhase: 'pageBottom',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(onPageBottomSpy).toHaveBeenCalled();
        done();
      });
    });

    it('calls window.s_gi to initialize the library', function(done) {
      var windowSpy = jasmine.createSpyObj('window', ['s_gi']);

      var loadLibrary = getLoadLibrary({
        'window': windowSpy
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).then(function() {
        expect(windowSpy.s_gi).toHaveBeenCalledWith('aa');
        done();
      });
    });

    it('throws an error if window,s_gi is not defined', function(done) {
      var loadLibrary = getLoadLibrary({
        'window': {}
      });

      loadLibrary({
        libraryCode: {
          type: 'managed',
          accounts: {
            production: ['aa']
          }
        }
      }).catch(function(e) {
        expect(e).toEqual(jasmine.stringMatching('`s_gi` method not found.'));
        done();
      });
    });

    it('calls window.s_gi with specified build info environment report suites to initialize the ' +
      'library', function(done) {
      var windowSpy = jasmine.createSpyObj('window', ['s_gi']);

      var loadLibrary = getLoadLibrary({
        'window': windowSpy,
        'build-info': {
          environment: 'development'
        }
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
        expect(windowSpy.s_gi).toHaveBeenCalledWith('bb');
        done();
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
        'window': windowSpy
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
        'window': windowSpy
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
        'window': windowSpy
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
        'load-script': loadScriptSpy,
        'window': {
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
        'load-script': loadScriptSpy,
        'window': {
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
      var onPageBottomSpy = jasmine.createSpy('on-page-bottom').and.callFake(function(callback) {
        callback();
      });

      var loadLibrary = getLoadLibrary({
        'on-page-bottom': onPageBottomSpy,
        'window': {
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
        expect(onPageBottomSpy).toHaveBeenCalled();
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
        'window': windowSpy
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
        'load-script': loadScriptSpy,
        'window': {
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
        'load-script': loadScriptSpy,
        'window': {
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
        'load-script': loadScriptSpy,
        'window': {
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
      var onPageBottomSpy = jasmine.createSpy('on-page-bottom').and.callFake(function(callback) {
        callback();
      });

      var loadLibrary = getLoadLibrary({
        'on-page-bottom': onPageBottomSpy,
        'window': {
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
        expect(onPageBottomSpy).toHaveBeenCalled();
        done();
      });
    });

    it('throws an error if tracker is not found at the specified varible', function(done) {
      var loadLibrary = getLoadLibrary({
        'window': {
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
        'window': windowSpy
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
