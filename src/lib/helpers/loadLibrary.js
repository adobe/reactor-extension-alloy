'use strict';

var buildInfo = require('build-info');
var loadScript = require('load-script');
var logger = require('logger');
var onPageBottom = require('on-page-bottom');
var window = require('window');
var Promise = require('promise');

var APP_MEASUREMENT_URL =
  'https://assets.adobedtm.com/activation/libs/app-measurement/1.6/AppMeasurement.js';

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

var waitForPageLoadingPhase = function(loadPhase) {
  if (loadPhase === 'pageBottom') {
    return new Promise(function(resolve) {
      onPageBottom(function() {
        logger.info('Loading AppMeasurement script at the bottom of the page.');
        resolve();
      })
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

var createTracker = function(accounts) {
  if (!window.s_gi) {
    throw new Error(
      'Cannot create tracker. `s_gi` method not found.'
    );
  }

  var reportSuites = getReportSuites(accounts);
  logger.info('Creating tracker with the following report suite(s): "' + reportSuites + '".');
  return window.s_gi(reportSuites);
};

var loadManagedLibrary = function(configuration) {
  return waitForPageLoadingPhase(configuration.libraryCode.loadPhase || 'pageBottom')
    .then(loadAppMeasurementScript.bind(null, APP_MEASUREMENT_URL))
    .then(createTracker.bind(null, configuration.libraryCode.accounts));
};

var setReportSuitesOnTracker = function(configuration, tracker) {
  if (configuration.libraryCode.accounts) {
    if (!tracker.sa) {
      logger.warn('Cannot set report suites on tracker. `sa` method not available.');
    } else {
      var reportSuites = getReportSuites(configuration.libraryCode.accounts);
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

var detectPreinstalledLibrary = function(configuration) {
  return poll(configuration.libraryCode.trackerVariableName)
    .then(setReportSuitesOnTracker.bind(null, configuration));
};

var getTrackerFromVariable = function(trackerVariableName) {
  if (window[trackerVariableName]) {
    logger.info('Found tracker located at: "' + trackerVariableName + '".');
    return window[trackerVariableName];
  } else {
    throw new Error('Cannot find the global variable name: "' + trackerVariableName + '".');
  }
};

var loadRemoteLibrary = function(url, configuration) {
  var loadPhase = configuration.libraryCode.loadPhase || 'pageBottom';

  return waitForPageLoadingPhase(loadPhase)
    .then(loadAppMeasurementScript.bind(null, url))
    .then(getTrackerFromVariable.bind(null, configuration.libraryCode.trackerVariableName))
    .then(setReportSuitesOnTracker.bind(null, configuration));
};

module.exports = function(configuration) {
  var url;
  var libraryPromise;

  switch (configuration.libraryCode.type) {
    case LIB_TYPES.MANAGED:
      libraryPromise = loadManagedLibrary(configuration);
      break;

    case LIB_TYPES.PREINSTALLED:
      libraryPromise = detectPreinstalledLibrary(configuration);
      break;

    case LIB_TYPES.CUSTOM:
      url = configuration.libraryCode.source;

      libraryPromise = loadRemoteLibrary(url, configuration);
      break;

    case LIB_TYPES.REMOTE:
      url = window.location.protocol === 'https:' ?
        configuration.libraryCode.httpsUrl : configuration.libraryCode.httpUrl;

      libraryPromise = loadRemoteLibrary(url, configuration);
      break;

    default:
      throw new Error('Cannot load library. Type not supported.');
  }

  return libraryPromise;
};
