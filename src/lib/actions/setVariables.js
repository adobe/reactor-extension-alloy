'use strict';

var logger = require('logger');

var getTracker = require('../helpers/getTracker');
var applyTrackerVariables = require('../helpers/applyTrackerVariables');
var getExtensionConfigurations = require('get-extension-configurations');

module.exports = function(settings, targetElement, event) {
  var extensionConfigurations = getExtensionConfigurations();
  if (settings.extensionConfigurationIds) {
    extensionConfigurations = extensionConfigurations.filter(function(extensionsConfiguration) {
      return settings.extensionConfigurationIds.indexOf(extensionsConfiguration.id) !== -1;
    });
  }

  extensionConfigurations.forEach(function(configuration) {
    getTracker(configuration.id).then(function(tracker) {
      applyTrackerVariables(tracker, settings.trackerProperties);
      if (settings.customSetup && settings.customSetup.source) {
        settings.customSetup.source.call(targetElement, event, tracker);
      }
    }, function(errorMessage) {
      logger.error(
        'Cannot set variables on the tracker for configuration "' +
        configuration.name +
        '": ' +
        errorMessage
      );
    });
  });
};
