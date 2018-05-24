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

var setVariablesInjector = require('inject!../setVariables');
var Promise = require('@adobe/reactor-promise');

describe('set variables', function() {
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

  it('applies the provided variables', function(done) {
    var applyTrackerVariablesSpy = jasmine.createSpy('../helpers/applyTrackerVariables');
    var tracker = {};
    var trackerProperties = {
      a: 'b'
    };

    var setVariables = setVariablesInjector({
      '../helpers/applyTrackerVariables': applyTrackerVariablesSpy,
      '../sharedModules/getTracker': function() {
        return Promise.resolve(tracker);
      }
    });

    setVariables({
      trackerProperties: trackerProperties
    }, {
      element: {}
    }).then(function() {
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
      '../sharedModules/getTracker': function() {
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
    }, {
      element: {}
    }).then(function() {
      expect(tracker.a).toBe('custom');
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var setVariables = setVariablesInjector({
      '../sharedModules/getTracker': function() {
        return Promise.reject('some error');
      }
    });

    setVariables({}, {}).then(function() {
      expect(mockTurbine.logger.error).toHaveBeenCalled();
      done();
    });
  });
});
