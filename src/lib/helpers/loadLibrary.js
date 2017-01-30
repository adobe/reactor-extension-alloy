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
var loadScript = require('@turbine/load-script');
var logger = require('@turbine/logger');
var onPageBottom = require('@turbine/on-page-bottom');
var window = require('@turbine/window');
var Promise = require('@turbine/promise');
var getHostedLibFileUrl = require('@turbine/get-hosted-lib-file-url');

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

var loadManagedLibrary = function(settings) {
  return waitForPageLoadingPhase(settings.libraryCode.loadPhase || 'pageBottom')
    .then(loadManagedAppMeasurementScript.bind(null, getHostedLibFileUrl('AppMeasurement.js')))
    .then(createTracker)
    .then(setReportSuitesOnTracker.bind(null, settings));
};

var setReportSuitesOnTracker = function(settings, tracker) {
  if (settings.libraryCode.accounts) {
    if (!tracker.sa) {
      logger.warn('Cannot set report suites on tracker. `sa` method not available.');
    } else {
      var reportSuites = getReportSuites(settings.libraryCode.accounts);
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

var detectPreinstalledLibrary = function(settings) {
  return poll(settings.libraryCode.trackerVariableName)
    .then(setReportSuitesOnTracker.bind(null, settings));
};

var getTrackerFromVariable = function(trackerVariableName) {
  if (window[trackerVariableName]) {
    logger.info('Found tracker located at: "' + trackerVariableName + '".');
    return window[trackerVariableName];
  } else {
    throw new Error('Cannot find the global variable name: "' + trackerVariableName + '".');
  }
};

var loadRemoteLibrary = function(url, settings) {
  var loadPhase = settings.libraryCode.loadPhase || 'pageBottom';

  return waitForPageLoadingPhase(loadPhase)
    .then(loadAppMeasurementScript.bind(null, url))
    .then(getTrackerFromVariable.bind(null, settings.libraryCode.trackerVariableName))
    .then(setReportSuitesOnTracker.bind(null, settings));
};

module.exports = function(settings) {
  var url;
  var libraryPromise;

  switch (settings.libraryCode.type) {
    case LIB_TYPES.MANAGED:
      libraryPromise = loadManagedLibrary(settings);
      break;

    case LIB_TYPES.PREINSTALLED:
      libraryPromise = detectPreinstalledLibrary(settings);
      break;

    case LIB_TYPES.CUSTOM:
      url = settings.libraryCode.source;

      libraryPromise = loadRemoteLibrary(url, settings);
      break;

    case LIB_TYPES.REMOTE:
      url = window.location.protocol === 'https:' ?
        settings.libraryCode.httpsUrl : settings.libraryCode.httpUrl;

      libraryPromise = loadRemoteLibrary(url, settings);
      break;

    default:
      throw new Error('Cannot load library. Type not supported.');
  }

  return libraryPromise;
};
