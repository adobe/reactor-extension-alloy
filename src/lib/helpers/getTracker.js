'use strict';

var buildInfo = require('@turbine/build-info');
var cookie = require('@turbine/cookie');
var document = require('@turbine/document');
var logger = require('@turbine/logger');
var Promise = require('@turbine/promise');
var propertySettings =  require('@turbine/property-settings');
var window = require('@turbine/window');
var getExtensionConfigurations = require('@turbine/get-extension-configurations');
var getSharedModule = require('@turbine/get-shared-module');

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

  var cookieName = propertySettings.euCookieName;
  var euCookieValue = cookie.parse(document.cookie)[cookieName];
  return euCookieValue === 'true';
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

var initialize = function(configuration) {
  var configurationSettings = configuration.settings || {};

  if (checkEuCompliance(configurationSettings.euComplianceEnabled || false)) {
    return loadLibrary(configurationSettings)
      .then(linkVisitorId)
      .then(updateTrackerVersion)
      .then(updateTrackerVariables.bind(
        null,
        configurationSettings.trackerProperties,
        configurationSettings.customSetup || {}
      ));
  } else {
    return Promise.reject('EU compliance was not acknowledged by the user.');
  }
};

var createPromiseStore = function(configurations) {
  var store = {};

  configurations.forEach(function(configuration) {
    store[configuration.id] =  new Promise(function(resolve, reject) {
      logger.info(
        'Initializing Adobe Analytics extension for configuration "' +
        configuration.name +
        '".'
      );

      initialize(configuration)
        .then(resolve, reject);
    });
  });

  return store;
};
var store = createPromiseStore(getExtensionConfigurations());

module.exports = function(extensionConfigurationId) {
  return store[extensionConfigurationId];
};
