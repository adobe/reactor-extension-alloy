'use strict';

var getExtension = require('get-extension');
var logger = require('logger');

var adobeAnalyticsExtension = getExtension('adobe-analytics');
var getTracker = adobeAnalyticsExtension.getHelper('get-tracker');
var applyTrackerVariables = adobeAnalyticsExtension.getHelper('apply-tracker-variables');

module.exports = function(settings, targetElement, event) {
  var configurations = settings.extensionConfigurationIds ||
    Object.keys(adobeAnalyticsExtension.getConfigurations());

  configurations.forEach(function(configurationId) {
    getTracker(configurationId).then(function(tracker) {
      applyTrackerVariables(tracker, settings.trackerProperties);
      if (settings.customSetup) {
        settings.customSetup.script.call(targetElement, event, tracker);
      }
    }, function(errorMessage) {
      logger.error(
        'Cannot set variables on the tracker for configuration "' +
        configurationId +
        '": ' +
        errorMessage
      );
    });
  });
};
