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

var sendBeaconInjector = require('inject!../sendBeacon');
var Promise = require('@adobe/reactor-promise');

describe('send beacon', function() {
  var mockTurbine;

  beforeAll(function() {
    mockTurbine = {
      logger: jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log'])
    };
    mockTurbineVariable(mockTurbine);
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  it('fires a page view pixel', function(done) {
    var tracker = {
      t: jasmine.createSpy('t')
    };

    var sendBeacon = sendBeaconInjector({
      '../sharedModules/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    sendBeacon({
      type: 'page'
    }, {
      element: {}
    }).then(function() {
      expect(tracker.t).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var sendBeacon = sendBeaconInjector({
      '../sharedModules/getTracker': function() {
        return Promise.reject('some error');
      }
    });

    sendBeacon({}).then(function() {
      expect(mockTurbine.logger.error).toHaveBeenCalled();
      done();
    });
  });

  it('fires a custom link pixel', function(done) {
    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var sendBeacon = sendBeaconInjector({
      '../sharedModules/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    sendBeacon({
      type: 'link'
    }, {
      element: {}
    }).then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith('true', 'o', 'link clicked');
      done();
    });
  });

  it('sends the custom link beacon using the link name and link type provided', function(done) {
    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var sendBeacon = sendBeaconInjector({
      '../sharedModules/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    sendBeacon({
      type: 'link',
      linkName: 'some name',
      linkType: 'c'
    }, {
      element: {}
    }).then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith('true', 'c', 'some name');
      done();
    });
  });

  it('sends the custom link beacon using the target element when possible', function(done) {
    var ruleElement = document.createElement('a');
    ruleElement.innerHTML = 'link';

    var tracker = {
      tl: jasmine.createSpy('tl')
    };

    var sendBeacon = sendBeaconInjector({
      '../sharedModules/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    sendBeacon({
      type: 'link',
    }, {
      element: ruleElement
    }).then(function() {
      expect(tracker.tl.calls.count()).toBe(1);
      expect(tracker.tl).toHaveBeenCalledWith(ruleElement, 'o', 'link');
      done();
    });
  });
});
