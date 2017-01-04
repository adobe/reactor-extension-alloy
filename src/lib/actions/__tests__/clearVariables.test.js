'use strict';

var clearVariablesInjector = require('inject!../clearVariables');
var Promise = require('@reactor/turbine/lib/require')('@turbine/promise');

var getClearVariables = function(mocks) {
  mocks = mocks || {};

  mocks['@turbine/get-extension-configurations'] = mocks['@turbine/get-extension-configurations'] ||
    function() {
      return [{
        id: 'EX1',
        name: 'EX1'
      }];
    };

  return clearVariablesInjector(mocks);
};

describe('clear variables', function() {
  it('sends the beacon for a configuration', function(done) {
    var tracker = {
      clearVars: jasmine.createSpy('clearVars')
    };

    var promise = Promise.resolve(tracker);

    var clearVariables = getClearVariables({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    clearVariables({
      extensionConfigurationIds: ['EX1']
    });

    promise.then(function() {
      expect(tracker.clearVars).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('sends the beacon for multiple configurations', function(done) {
    var tracker = {
      clearVars: jasmine.createSpy('clearVars')
    };

    var promise = Promise.resolve(tracker);

    var clearVariables = getClearVariables({
      '../helpers/getTracker': function() {
        return promise;
      },
      '@turbine/get-extension-configurations': function() {
        return [{
          id: 'EX1',
          name: 'EX1'
        },{
          id: 'EX2',
          name: 'EX2'
        }];
      }
    });

    clearVariables({
      extensionConfigurationIds: ['EX1', 'EX2']
    });

    promise.then(function() {
      expect(tracker.clearVars).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('sends the beacon for all the configurations when extensionConfigurationIds is missing',
    function(done) {
      var tracker = {
        clearVars: jasmine.createSpy('clearVars')
      };
      var promise = Promise.resolve(tracker);

      var clearVariables = getClearVariables({
        '@turbine/get-extension-configurations': function() {
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
        '../helpers/getTracker': function() {
          return promise;
        }
      });

      clearVariables({});

      promise.then(function() {
        expect(tracker.clearVars).toHaveBeenCalledTimes(3);
        done();
      });
    });
});
