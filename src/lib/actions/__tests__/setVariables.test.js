'use strict';

var setVariablesInjector = require('inject!../setVariables');
var Promise = require('@reactor/turbine/lib/require')('promise');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getSetVariables = function(mocks) {
  mocks = mocks || {};

  mocks['get-extension-configurations'] = mocks['get-extension-configurations'] ||
    function() {
      return [{
        id: 'EX1',
        name: 'EX1'
      }];
    };

  return setVariablesInjector(mocks);
};

describe('set variables', function() {
  it('applies the variables for a configuration', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables');
    var tracker = {};
    var trackerProperties = {
      a: 'b'
    };

    var promise = Promise.resolve(tracker);

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    setVariables({
      extensionConfigurationIds: ['EX1'],
      trackerProperties: trackerProperties
    });

    promise.then(function() {
      expect(applyTrackerVariablesSpy).toHaveBeenCalledWith(tracker, trackerProperties);
      done();
    });
  });

  it('applies the variables for multiple configurations', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables');
    var tracker = {};

    var promise = Promise.resolve(tracker);

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../helpers/getTracker': function() {
        return promise;
      },
      'get-extension-configurations': function() {
        return [{
          id: 'EX1',
          name: 'EX1'
        },{
          id: 'EX2',
          name: 'EX2'
        }];
      }
    });

    setVariables({
      extensionConfigurationIds: ['EX1', 'EX2'],
      trackerProperties: {
        a: 'b'
      }
    });

    promise.then(function() {
      expect(applyTrackerVariablesSpy.calls.count()).toBe(2);
      done();
    });
  });

  it('applies the variables for all the configurations when extensionConfigurationIds is missing',
    function(done) {
      var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables');
      var tracker = {};

      var promise = Promise.resolve(tracker);

      var setVariables = getSetVariables({
        'get-extension-configurations': function() {
          return [{
            id: 'EX1',
            name: 'EX1'
          },{
            id: 'EX2',
            name: 'EX2'
          },{
            id: 'EX3',
            name: 'EX3'
          }];
        },
        '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
        '../helpers/getTracker': function() {
          return promise;
        }
      });

      setVariables({
        trackerProperties: {
          a: 'b'
        }
      });

      promise.then(function() {
        expect(applyTrackerVariablesSpy.calls.count()).toBe(3);
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

    var setVariables = getSetVariables({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../helpers/getTracker': function() {
        return promise;
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

    promise.then(function() {
      expect(tracker.a).toBe('custom');
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var promise = Promise.reject('some error');
    var setVariables = getSetVariables({
      '../helpers/getTracker': function() {
        return promise;
      },
      logger: loggerSpy
    });

    setVariables({
      extensionConfigurationIds: ['EX1']
    });

    promise.then(null, function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });
});
