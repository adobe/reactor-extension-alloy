'use strict';

var sendBeaconInjector = require('inject!../sendBeacon');
var Promise = require('@reactor/turbine/lib/require')('@turbine/promise');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

var getSendBeacon = function(mocks) {
  mocks = mocks || {};

  mocks['@turbine/get-extension-configurations'] = mocks['@turbine/get-extension-configurations'] ||
    function() {
      return [{
        id: 'EX1',
        name: 'EX1'
      }];
    };

  return sendBeaconInjector(mocks);
};

describe('send beacon', function() {
  it('sends the beacon for a configuration', function(done) {
    var tracker = {
      t: jasmine.createSpy('t')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = getSendBeacon({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      extensionConfigurationIds: ['EX1'],
      type: 'page'
    });

    promise.then(function() {
      expect(tracker.t).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('sends the beacon for multiple configurations', function(done) {
    var tracker = {
      t: jasmine.createSpy('t')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = getSendBeacon({
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

    sendBeacon({
      extensionConfigurationIds: ['EX1', 'EX2'],
      type: 'page'
    });

    promise.then(function() {
      expect(tracker.t).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('sends the beacon for all the configurations when extensionConfigurationIds is missing',
    function(done) {
      var tracker = {
        t: jasmine.createSpy('t')
      };

      var promise = Promise.resolve(tracker);

      var sendBeacon = getSendBeacon({
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

      sendBeacon({
        type: 'page'
      });

      promise.then(function() {
        expect(tracker.t).toHaveBeenCalledTimes(3);
        done();
      });
    });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var promise = Promise.reject('some error');
    var sendBeacon = getSendBeacon({
      '../helpers/getTracker': function() {
        return promise;
      },
      '@turbine/logger': loggerSpy
    });

    sendBeacon({
      extensionConfigurationIds: ['EX1']
    });

    promise.then(null, function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });

  it('sends the custom link beacon for a configuration', function(done) {
    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = getSendBeacon({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      extensionConfigurationIds: ['EX1']
    });

    promise.then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith('true', 'o', 'link clicked');
      done();
    });
  });

  it('sends the custom link beacon using the link name and link type provided', function(done) {
    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = getSendBeacon({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      extensionConfigurationIds: ['EX1'],
      linkName: 'some name',
      linkType: 'c'
    });

    promise.then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith('true', 'c', 'some name');
      done();
    });
  });

  it('sends the custom link beacon using the target element when possible', function(done) {
    var targetElement = document.createElement('a');
    targetElement.innerHTML = 'link';

    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = getSendBeacon({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      extensionConfigurationIds: ['EX1']
    }, targetElement);

    promise.then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith(targetElement, 'o', 'link');
      done();
    });
  });
});
