'use strict';

var publicRequire = require('../../__tests__/helpers/publicRequire');
var setVariablesInjector = require('inject!../setVariables');
var Promise = publicRequire('promise');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getSetVariables = function(mocks) {
  return setVariablesInjector({
    'logger': (mocks && mocks.logger) || getLoggerMockObject(),
    'get-extension-configurations': (mocks && mocks['get-extension-configurations'])
      || function() {},
    '../helpers/getTracker.js': (mocks && mocks['../helpers/getTracker.js']) ||
    function() {
      return Promise.resolve({});
    },
    '../helpers/applyTrackerVariables.js':
      (mocks && mocks['../helpers/applyTrackerVariables.js']) || function() {}
  });
};

describe('set variables', function() {
  it('applies the variables for a configuration', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables.js');
    var tracker = {};
    var trackerProperties = {
      a: 'b'
    };

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables.js': applyTrackerVariablesSpy,
      '../helpers/getTracker.js': function() {
        return Promise.resolve(tracker);
      }
    });

    setVariables({
      extensionConfigurationIds: ['EX1'],
      trackerProperties: trackerProperties
    });

    setTimeout(function() {
      expect(applyTrackerVariablesSpy).toHaveBeenCalledWith(tracker, trackerProperties);
      done();
    });
  });

  it('applies the variables for multiple configurations', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables.js');
    var tracker = {};

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables.js': applyTrackerVariablesSpy,
      '../helpers/getTracker.js': function() {
        return Promise.resolve(tracker);
      }
    });

    setVariables({
      extensionConfigurationIds: ['EX1', 'EX2'],
      trackerProperties: {
        a: 'b'
      }
    });

    setTimeout(function() {
      expect(applyTrackerVariablesSpy.calls.count()).toBe(2);
      done();
    });
  });

  it('applies the variables for all the configurations when extensionConfigurationIds is missing',
    function(done) {
      var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables.js');
      var tracker = {};

      var setVariables = getSetVariables({
        'get-extension-configurations': function() {
          return {
            'EX1': {},
            'EX2': {},
            'EX3': {}
          };
        },
        '../helpers/applyTrackerVariables.js': applyTrackerVariablesSpy,
        '../helpers/getTracker.js': function() {
          return Promise.resolve(tracker);
        }
      });

      setVariables({
        trackerProperties: {
          a: 'b'
        }
      });

      setTimeout(function() {
        expect(applyTrackerVariablesSpy.calls.count()).toBe(3);
        done();
      });
    });

  it('calls the custom setup method when available', function(done) {
    var applyTrackerVariablesSpy =
      jasmine.createSpy('../helpers/applyTrackerVariables.js').and.callFake(function(s, props) {
        s.a = props.a;
      });

    var tracker = {};

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables.js': applyTrackerVariablesSpy,
      '../helpers/getTracker.js': function() {
        return Promise.resolve(tracker);
      }
    });

    setVariables({
      extensionConfigurationIds: ['EX1'],
      trackerProperties: {
        a: 'b'
      },
      customSetup: {
        source: function(e, tracker) {
          tracker.a = 'custom';
        }
      }
    });

    setTimeout(function() {
      expect(tracker.a).toBe('custom');
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var setVariables = getSetVariables({
      '../helpers/getTracker.js': function() {
        return Promise.reject('some error');
      },
      logger: loggerSpy
    });

    setVariables({
      extensionConfigurationIds: ['EX1']
    });

    setTimeout(function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });
});
