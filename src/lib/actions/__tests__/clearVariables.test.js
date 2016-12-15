'use strict';

var clearVariablesInjector = require('inject!../clearVariables');
var Promise = require('@reactor/turbine/lib/require')('promise');

var getClearVariables = function(mocks) {
  mocks = mocks || {};

  mocks['get-extension-configurations'] = mocks['get-extension-configurations'] ||
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

    var clearVariables = getClearVariables({
      '../helpers/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    clearVariables({
      extensionConfigurationIds: ['EX1']
    });

    setTimeout(function() {
      expect(tracker.clearVars).toHaveBeenCalledTimes(1);
      done();
    }, 20);
  });

  it('sends the beacon for multiple configurations', function(done) {
    var tracker = {
      clearVars: jasmine.createSpy('clearVars')
    };

    var clearVariables = getClearVariables({
      '../helpers/getTracker': function() {
        return Promise.resolve(tracker);
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

    clearVariables({
      extensionConfigurationIds: ['EX1', 'EX2']
    });

    setTimeout(function() {
      expect(tracker.clearVars).toHaveBeenCalledTimes(2);
      done();
    }, 20);
  });

  it('sends the beacon for all the configurations when extensionConfigurationIds is missing',
    function(done) {
      var tracker = {
        clearVars: jasmine.createSpy('clearVars')
      };

      var clearVariables = getClearVariables({
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
        '../helpers/getTracker': function() {
          return Promise.resolve(tracker);
        }
      });

      clearVariables({});

      setTimeout(function() {
        expect(tracker.clearVars).toHaveBeenCalledTimes(3);
        done();
      }, 20);
    });
});
