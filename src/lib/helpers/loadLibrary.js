'use strict';

var buildInfo = require('build-info');
var loadScript = require('load-script');
var logger = require('logger');
var onPageBottom = require('on-page-bottom');
var window = require('window');
var Promise = require('promise');
var getHostedLibFileUrl = require('get-hosted-lib-file-url');

var LIB_TYPES = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

var loadAppMeasurementScript = function(url) {
  logger.info('Loading AppMeasurement script from: ' + url + '.');
  return loadScript(url);
};

var appMeasurementLoadPromise = null;
var loadManagedAppMeasurementScript = function(url) {
  if (appMeasurementLoadPromise) {
    logger.info('AppMeasurement script is already loading in the page.');
    return appMeasurementLoadPromise;
  }

  appMeasurementLoadPromise = loadAppMeasurementScript(url);
  return appMeasurementLoadPromise;
};

var waitForPageLoadingPhase = function(loadPhase) {
  if (loadPhase === 'pageBottom') {
    return new Promise(function(resolve) {
      onPageBottom(function() {
        logger.info('Loading AppMeasurement script at the bottom of the page.');
        resolve();
      });
    });
  } else {
    logger.info('Loading AppMeasurement script at the top of the page.');
    return Promise.resolve('pageTop');
  }
};

var getReportSuites = function(reportSuitesData) {
  var reportSuiteValues = reportSuitesData.production;
  if (reportSuitesData[buildInfo.environment]) {
    reportSuiteValues = reportSuitesData[buildInfo.environment];
  }

  return reportSuiteValues.join(',');
};

var createTracker = function() {
  if (!window.AppMeasurement) {
    throw new Error(
      'Cannot create tracker. `AppMeasurement` method not found.'
    );
  }

  logger.info('Creating AppMeasurement tracker.');
  return new window.AppMeasurement();
};

var loadManagedLibrary = function(configurationSettings) {
  return waitForPageLoadingPhase(configurationSettings.libraryCode.loadPhase || 'pageBottom')
    .then(loadManagedAppMeasurementScript.bind(null, getHostedLibFileUrl('AppMeasurement.js')))
    .then(createTracker)
    .then(setReportSuitesOnTracker.bind(null, configurationSettings));
};

var setReportSuitesOnTracker = function(configurationSettings, tracker) {
  if (configurationSettings.libraryCode.accounts) {
    if (!tracker.sa) {
      logger.warn('Cannot set report suites on tracker. `sa` method not available.');
    } else {
      var reportSuites = getReportSuites(configurationSettings.libraryCode.accounts);
      logger.info('Setting the following report suites on the tracker: "' + reportSuites + '"');
      tracker.sa(reportSuites);
    }
  }

  return tracker;
};

var poll = function(trackerVariableName) {
  logger.info('Waiting for the tracker to become accessible at: "' + trackerVariableName + '".');
  return new Promise(function(resolve, reject) {
    var i = 1;
    var intervalId = setInterval(function() {
      if (window[trackerVariableName]) {
        logger.info('Found tracker located at: "' + trackerVariableName + '".');
        resolve(window[trackerVariableName]);
        clearInterval(intervalId);
      }

      if (i >= 10) {
        clearInterval(intervalId);
        reject(new Error(
          'Bailing out. Cannot find the global variable name: "' + trackerVariableName + '".'
        ));
      }

      i++;
    }, 1000);
  });
};

var detectPreinstalledLibrary = function(configurationSettings) {
  return poll(configurationSettings.libraryCode.trackerVariableName)
    .then(setReportSuitesOnTracker.bind(null, configurationSettings));
};

var getTrackerFromVariable = function(trackerVariableName) {
  if (window[trackerVariableName]) {
    logger.info('Found tracker located at: "' + trackerVariableName + '".');
    return window[trackerVariableName];
  } else {
    throw new Error('Cannot find the global variable name: "' + trackerVariableName + '".');
  }
};

var loadRemoteLibrary = function(url, configurationSettings) {
  var loadPhase = configurationSettings.libraryCode.loadPhase || 'pageBottom';

  return waitForPageLoadingPhase(loadPhase)
    .then(loadAppMeasurementScript.bind(null, url))
    .then(getTrackerFromVariable.bind(null, configurationSettings.libraryCode.trackerVariableName))
    .then(setReportSuitesOnTracker.bind(null, configurationSettings));
};

module.exports = function(configurationSettings) {
  var url;
  var libraryPromise;

  switch (configurationSettings.libraryCode.type) {
    case LIB_TYPES.MANAGED:
      libraryPromise = loadManagedLibrary(configurationSettings);
      break;

    case LIB_TYPES.PREINSTALLED:
      libraryPromise = detectPreinstalledLibrary(configurationSettings);
      break;

    case LIB_TYPES.CUSTOM:
      url = configurationSettings.libraryCode.source;

      libraryPromise = loadRemoteLibrary(url, configurationSettings);
      break;

    case LIB_TYPES.REMOTE:
      url = window.location.protocol === 'https:' ?
        configurationSettings.libraryCode.httpsUrl : configurationSettings.libraryCode.httpUrl;

      libraryPromise = loadRemoteLibrary(url, configurationSettings);
      break;

    default:
      throw new Error('Cannot load library. Type not supported.');
  }

  return libraryPromise;
};
