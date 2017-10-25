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

var cookie = require('@adobe/reactor-cookie');
var Promise = require('@adobe/reactor-promise');
var window = require('@adobe/reactor-window');
var augmenters = require('../helpers/augmenters');

var applyTrackerVariables = require('./applyTrackerVariables');
var loadLibrary = require('./loadLibrary');
var generateVersion = require('./generateVersion');

var version = generateVersion(turbine.buildInfo.turbineBuildDate);
var BEFORE_SETTINGS_LOAD_PHASE = 'beforeSettings';

var mcidInstance = turbine.getSharedModule('adobe-mcid', 'mcid-instance');

var checkEuCompliance = function(euComplianceRequired) {
  if (!euComplianceRequired) {
    return true;
  }

  var cookieName = turbine.propertySettings.trackingCookieName;
  var euCookieValue = cookie.get(cookieName);
  return euCookieValue === 'true';
};

var augmentTracker = function(tracker) {
  return Promise.all(augmenters.map(function(augmenterFn) {
    var result;

    // If a tracker augmenter fails, we don't want to fail too. We'll re-throw the error in a
    // timeout so it still hits the console but doesn't reject our promise.
    try {
      result = augmenterFn(tracker);
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }

    return Promise.resolve(result);
  })).then(function() {
    return tracker;
  });
};

var linkVisitorId = function(tracker) {
  if (mcidInstance) {
    turbine.logger.info('Setting MCID instance on the tracker.');
    tracker.visitor = mcidInstance;
  }

  return tracker;
};

var updateTrackerVersion = function(tracker) {
  turbine.logger.info('Setting version on tracker: "' + version + '".');

  if (typeof tracker.tagContainerMarker !== 'undefined') {
    tracker.tagContainerMarker = version;
  } else if (typeof tracker.version === 'string'
    && tracker.version.substring(tracker.version.length - 5) !== ('-' + version)) {
    tracker.version += '-' + version;
  }

  return tracker;
};

var updateTrackerVariables = function(trackerProperties, customSetup, tracker) {
  if (customSetup.loadPhase === BEFORE_SETTINGS_LOAD_PHASE && customSetup.source) {
    turbine.logger.info('Calling custom script before settings.');
    customSetup.source.call(window, tracker);
  }

  applyTrackerVariables(tracker, trackerProperties || {});

  if (customSetup.loadPhase !== BEFORE_SETTINGS_LOAD_PHASE && customSetup.source) {
    turbine.logger.info('Calling custom script after settings.');
    customSetup.source.call(window, tracker);
  }

  return tracker;
};

var initialize = function(settings) {
  if (checkEuCompliance(settings.euComplianceEnabled || false)) {
    return loadLibrary(settings)
      .then(augmentTracker)
      .then(linkVisitorId)
      .then(updateTrackerVersion)
      .then(updateTrackerVariables.bind(
        null,
        settings.trackerProperties,
        settings.customSetup || {}
      ));
  } else {
    return Promise.reject('EU compliance was not acknowledged by the user.');
  }
};

var promise = initialize(turbine.getExtensionSettings());
module.exports = function() {
  return promise;
};
