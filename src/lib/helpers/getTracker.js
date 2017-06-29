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

var buildInfo = require('@turbine/build-info');
var cookie = require('@turbine/cookie');
var document = require('@turbine/document');
var logger = require('@turbine/logger');
var Promise = require('@turbine/promise');
var propertySettings =  require('@turbine/property-settings');
var window = require('@turbine/window');
var getExtensionSettings = require('@turbine/get-extension-settings');
var getSharedModule = require('@turbine/get-shared-module');
var augmenters = require('../helpers/augmenters');

var applyTrackerVariables = require('./applyTrackerVariables');
var loadLibrary = require('./loadLibrary');
var generateVersion = require('./generateVersion');

var version = generateVersion(buildInfo.turbineBuildDate);
var BEFORE_SETTINGS_LOAD_PHASE = 'beforeSettings';

var mcidInstance = getSharedModule('adobe-mcid', 'mcid-instance');

var checkEuCompliance = function(euComplianceRequired) {
  if (!euComplianceRequired) {
    return true;
  }

  var cookieName = propertySettings.trackingCookieName;
  var euCookieValue = cookie.parse(document.cookie)[cookieName];
  return euCookieValue === 'true';
};

var augmentTracker = function(tracker) {
  return Promise.all(augmenters.map(function(augmenterFn) {
    return Promise.resolve(augmenterFn(tracker));
  })).then(function() {
    return tracker;
  });
};

var linkVisitorId = function(tracker) {
  if (mcidInstance) {
    logger.info('Setting MCID instance on the tracker.');
    tracker.visitor = mcidInstance;
  }

  return tracker;
};

var updateTrackerVersion = function(tracker) {
  logger.info('Setting version on tracker: "' + version + '".');

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
    logger.info('Calling custom script before settings.');
    customSetup.source.call(window, tracker);
  }

  applyTrackerVariables(tracker, trackerProperties || {});

  if (customSetup.loadPhase !== BEFORE_SETTINGS_LOAD_PHASE && customSetup.source) {
    logger.info('Calling custom script after settings.');
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

var promise = initialize(getExtensionSettings());
module.exports = function() {
  return promise;
};
