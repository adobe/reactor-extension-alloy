'use strict';

var buildInfo = require('build-info');
var cookie = require('cookie');
var document = require('document');
var getExtension = require('get-extension');
var logger = require('logger');
var Promise = require('promise');
var propertySettings =  require('property-settings');
var window = require('window');

var adobeAnalyticsExtension = getExtension('adobe-analytics');
var applyTrackerVariables = adobeAnalyticsExtension.getHelper('apply-tracker-variables');
var loadLibrary = adobeAnalyticsExtension.getHelper('load-library');
var visitorIdExtension = getExtension('visitor-id');
var getVisitorIdInstance = visitorIdExtension.getHelper('get-visitor-id-instance');

var checkEuCompliance = function(euComplianceRequired) {
  if (!euComplianceRequired) {
    return true;
  }

  var cookieName = propertySettings.euCookieName || 'sat_track';
  var euCookieValue = cookie.parse(document.cookie)[cookieName];
  return euCookieValue === 'true';
};

var isVisitorIdInstalled = function() {
  return Object.keys(visitorIdExtension.getConfigurations()).length > 0;
};

var linkVisitorId = function(tracker) {
  if (isVisitorIdInstalled && getVisitorIdInstance) {
    return getVisitorIdInstance().then(function(visitorIdInstance) {
      logger.info('Setting Visitor ID instance on the tracker.');
      tracker.visitor = visitorIdInstance;
      return tracker;
    }, function() {
      logger.error('Cannot link Visitor ID instance.');
      return tracker;
    });
  }

  return tracker;
};

var updateTrackerVersion = function(tracker) {
  var version = 'D' + buildInfo.appVersion;
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
  if (customSetup.loadPhase === 'beforeSettings') {
    logger.info('Calling custom script before settings.');
    customSetup.script.call(window, null, tracker);
  }

  applyTrackerVariables(tracker, trackerProperties);

  if (customSetup.loadPhase === 'afterSettings') {
    logger.info('Calling custom script after settings.');
    customSetup.script.call(window, null, tracker);
  }

  return tracker;
};

var initialize = function(configuration) {
  if (checkEuCompliance(configuration.euComplianceEnabled || false)) {
    return loadLibrary(configuration)
      .then(linkVisitorId)
      .then(updateTrackerVersion)
      .then(updateTrackerVariables.bind(
        null,
        configuration.trackerProperties,
        configuration.customSetup || {}
      ));
  } else {
    return Promise.reject('EU compliance was not acknowledged by the user.');
  }
};

var createPromiseStore = function(configurations) {
  var store = {};

  Object.keys(configurations).forEach(function(configurationId) {
    store[configurationId] =  new Promise(function(resolve, reject) {
      logger.info(
        'Initializing Adobe Analytics extension for configuration "' +
        configurationId +
        '".'
      );

      initialize(configurations[configurationId])
        .then(resolve, reject);
    });
  });

  return store;
};
var store = createPromiseStore(adobeAnalyticsExtension.getConfigurations());

module.exports = function(extensionConfigurationId) {
  return store[extensionConfigurationId];
};
