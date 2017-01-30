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

var clearVariablesInjector = require('inject!../clearVariables');
var Promise = require('@adobe/composer-turbine/lib/require')('@turbine/promise');
var getLoggerMockObject = function() {
  return jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log']);
};

describe('clear variables', function() {
  it('removes the variables from the tracker', function(done) {
    var tracker = {
      clearVars: jasmine.createSpy('clearVars')
    };

    var promise = Promise.resolve(tracker);

    var clearVariables = clearVariablesInjector({
      '../helpers/getTracker': function() {
        return promise;
      }
    });

    clearVariables();

    promise.then(function() {
      expect(tracker.clearVars).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('logs an error when getTracker throws an error', function(done) {
    var loggerSpy = getLoggerMockObject();
    var promise = Promise.reject('some error');
    var clearVariables = clearVariablesInjector({
      '../helpers/getTracker': function() {
        return promise;
      },
      '@turbine/logger': loggerSpy
    });

    clearVariables();

    promise.then(null, function() {
      expect(loggerSpy.error).toHaveBeenCalled();
      done();
    });
  });
});
