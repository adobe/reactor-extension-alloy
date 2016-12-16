'use strict';

var logger = require('logger');
var getExtensionConfigurations = require('get-extension-configurations');
var getTracker = require('../helpers/getTracker');

module.exports = function(settings) {
  var extensionConfigurations = getExtensionConfigurations();
  if (settings.extensionConfigurationIds) {
    extensionConfigurations = extensionConfigurations.filter(function(extensionsConfiguration) {
      return settings.extensionConfigurationIds.indexOf(extensionsConfiguration.id) !== -1;
    });
  }

  extensionConfigurations.forEach(function(configuration) {
    getTracker(configuration.id).then(function(tracker) {
      if (tracker.clearVars) {
        logger.info('Clear variables for configuration "' + configuration.name + '".');
        tracker.clearVars();
      }
    }, function(errorMessage) {
      logger.error(
        'Cannot clear variables for configuration "' +
        configuration.name +
        '": ' +
        errorMessage
      );
    });
  });
};
