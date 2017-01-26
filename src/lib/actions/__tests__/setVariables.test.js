'use strict';

var setVariablesInjector = require('inject!../setVariables');
var Promise = require('@adobe/composer-turbine/lib/require')('@turbine/promise');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

describe('set variables', function() {
  it('applies the provided variables', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables');
    var tracker = {};
    var trackerProperties = {
      a: 'b'
    };

    var promise = Promise.resolve(tracker);

    var setVariables = setVariablesInjector({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    setVariables({
      trackerProperties: trackerProperties
    });

    promise.then(function() {
      expect(applyTrackerVariablesSpy).toHaveBeenCalledWith(tracker, trackerProperties);
      done();
    });
  });

  it('calls the custom setup method when available', function(done) {
    var applyTrackerVariablesSpy =
      jasmine.createSpy('../helpers/applyTrackerVariables').and.callFake(function(s, props) {
        s.a = props.a;
      });

    var tracker = {};

    var promise = Promise.resolve(tracker);

    var setVariables = setVariablesInjector({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    setVariables({
      trackerProperties: {
        a: 'b'
      },
      customSetup: {
        source: function(e, tracker) {
          tracker.a = 'custom';
        }
      }
    });

    promise.then(function() {
      expect(tracker.a).toBe('custom');
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var promise = Promise.reject('some error');
    var setVariables = setVariablesInjector({
      '../helpers/getTracker': function() {
        return promise;
      },
      '@turbine/logger': loggerSpy
    });

    setVariables({});

    promise.then(null, function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });
});
