'use strict';

var logger = require('logger');

var getTracker = require('../helpers/getTracker.js');
var applyTrackerVariables = require('../helpers/applyTrackerVariables.js');
var getExtensionConfigurations = require('get-extension-configurations');

module.exports = function(settings, targetElement, event) {
  var configurations = settings.extensionConfigurationIds ||
    Object.keys(getExtensionConfigurations());

  configurations.forEach(function(configurationId) {
    getTracker(configurationId).then(function(tracker) {
      applyTrackerVariables(tracker, settings.trackerProperties);
      if (settings.customSetup && settings.customSetup.script) {
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
