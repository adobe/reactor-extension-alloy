'use strict';

var sendBeaconInjector = require('inject!../sendBeacon');
var Promise = require('@reactor/turbine/lib/require')('@turbine/promise');

var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

describe('send beacon', function() {
  it('fires a page view pixel', function(done) {
    var tracker = {
      t: jasmine.createSpy('t')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = sendBeaconInjector({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      type: 'page'
    });

    promise.then(function() {
      expect(tracker.t).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var promise = Promise.reject('some error');
    var sendBeacon = sendBeaconInjector({
      '../helpers/getTracker': function() {
        return promise;
      },
      '@turbine/logger': loggerSpy
    });

    sendBeacon({});

    promise.then(null, function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });

  it('fires a custom link pixel', function(done) {
    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var promise = Promise.resolve(tracker);

    var sendBeacon = sendBeaconInjector({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      type: 'link'
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

    var sendBeacon = sendBeaconInjector({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      type: 'link',
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

    var sendBeacon = sendBeaconInjector({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    sendBeacon({
      type: 'link',
    }, targetElement);

    promise.then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith(targetElement, 'o', 'link');
      done();
    });
  });
});
