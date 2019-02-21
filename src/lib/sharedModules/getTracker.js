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
var loadScript = require('@adobe/reactor-load-script');

var applyTrackerVariables = require('../helpers/applyTrackerVariables');
var loadLibrary = require('../helpers/loadLibrary');
var generateVersion = require('../helpers/generateVersion');

var version = generateVersion(turbine.buildInfo.turbineBuildDate);
var BEFORE_SETTINGS_LOAD_PHASE = 'beforeSettings';

var mcidInstance = turbine.getSharedModule('adobe-mcid', 'mcid-instance');

var checkEuCompliance = function(trackingCoookieName) {
  if (!trackingCoookieName) {
    return true;
  }

  var euCookieValue = cookie.get(trackingCoookieName);
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

var loadTrackerModules = function(properties, tracker) {
  var moduleProperties = properties.moduleProperties;
  if (moduleProperties &&
      moduleProperties.audienceManager &&
      moduleProperties.audienceManager.config &&
      window._satellite &&
      window._satellite.company &&
      window._satellite.company.orgId) {
    var visitorServiceConfig = {
      namespace: window._satellite.company.orgId
    };
    moduleProperties.audienceManager.config.visitorService = visitorServiceConfig;
    var libFileName = 'AppMeasurement_Module_AudienceManagement.js';
    var libFileUrl = turbine.getHostedLibFileUrl(libFileName);
    return loadScript(libFileUrl)
    .then( function() {
      tracker.loadModule('AudienceManagement');
      turbine.logger.info('Initializing AudienceManagement module');
      //turbine.logger.info(JSON.stringify(moduleProperties.audienceManager.config, null, 3));
      tracker.AudienceManagement.setup(moduleProperties.audienceManager.config);
      return tracker;
    });
  } else {
    return tracker;
  }
};

var initialize = function(settings) {
  if (checkEuCompliance(settings.trackingCookieName)) {
    return loadLibrary(settings)
      .then(augmentTracker)
      .then(linkVisitorId)
      .then(updateTrackerVersion)
      .then(updateTrackerVariables.bind(
        null,
        settings.trackerProperties,
        settings.customSetup || {}
      ))
      .then(loadTrackerModules.bind(null, settings));
  } else {
    return Promise.reject('EU compliance was not acknowledged by the user.');
  }
};

var promise = initialize(turbine.getExtensionSettings());
module.exports = function() {
  return promise;
};
