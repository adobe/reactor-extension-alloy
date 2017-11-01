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

var loadScript = require('@adobe/reactor-load-script');
var window = require('@adobe/reactor-window');
var Promise = require('@adobe/reactor-promise');

var LIB_TYPES = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

var loadAppMeasurementScript = function(url) {
  turbine.logger.info('Loading AppMeasurement script from: ' + url + '.');
  return loadScript(url);
};

var appMeasurementLoadPromise = null;
var loadManagedAppMeasurementScript = function(url) {
  if (appMeasurementLoadPromise) {
    turbine.logger.info('AppMeasurement script is already loading in the page.');
    return appMeasurementLoadPromise;
  }

  appMeasurementLoadPromise = loadAppMeasurementScript(url);
  return appMeasurementLoadPromise;
};

var waitForPageLoadingPhase = function(loadPhase) {
  if (loadPhase === 'pageBottom') {
    return new Promise(function(resolve) {
      turbine.onPageBottom(function() {
        turbine.logger.info('Loading AppMeasurement script at the bottom of the page.');
        resolve();
      });
    });
  } else {
    turbine.logger.info('Loading AppMeasurement script at the top of the page.');
    return Promise.resolve('pageTop');
  }
};

var getReportSuites = function(reportSuitesData) {
  var reportSuiteValues = reportSuitesData.production;
  if (reportSuitesData[turbine.buildInfo.environment]) {
    reportSuiteValues = reportSuitesData[turbine.buildInfo.environment];
  }

  return reportSuiteValues.join(',');
};

var createTracker = function(reportSuites) {
  if (!window.s_gi) {
    throw new Error(
      'Unable to create AppMeasurement tracker, `s_gi` function not found.' + window.AppMeasurement
    );
  }
  turbine.logger.info('Creating AppMeasurement tracker with these report suites: "' +
    reportSuites + '"');
  return window.s_gi(reportSuites);
};

var loadManagedLibrary = function(settings) {
  var reportSuites = getReportSuites(settings.libraryCode.accounts);
  return waitForPageLoadingPhase(settings.libraryCode.loadPhase || 'pageBottom')
    .then(loadManagedAppMeasurementScript.bind(null,
      turbine.getHostedLibFileUrl('AppMeasurement.js')))
    .then(createTracker.bind(null, reportSuites));
};

var setReportSuitesOnTracker = function(settings, tracker) {
  if (settings.libraryCode.accounts) {
    if (!tracker.sa) {
      turbine.logger.warn('Cannot set report suites on tracker. `sa` method not available.');
    } else {
      var reportSuites = getReportSuites(settings.libraryCode.accounts);
      turbine.logger.info('Setting the following report suites on the tracker: "' +
        reportSuites + '"');
      tracker.sa(reportSuites);
    }
  }

  return tracker;
};

var poll = function(trackerVariableName) {
  turbine.logger.info('Waiting for the tracker to become accessible at: "' +
    trackerVariableName + '".');
  return new Promise(function(resolve, reject) {
    var i = 1;
    var intervalId = setInterval(function() {
      if (window[trackerVariableName]) {
        turbine.logger.info('Found tracker located at: "' + trackerVariableName + '".');
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
    turbine.logger.info('Found tracker located at: "' + trackerVariableName + '".');
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
