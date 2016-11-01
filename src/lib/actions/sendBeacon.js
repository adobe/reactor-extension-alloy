'use strict';

var logger = require('logger');
var getExtensionConfigurations = require('get-extension-configurations');
var getTracker = require('../helpers/getTracker');

var isLink = function(element) {
  return element && element.nodeName && element.nodeName.toLowerCase() === 'a';
};

var getLinkName = function(element) {
  if (isLink(element)) {
    return element.innerHTML;
  } else {
    return 'link clicked';
  }
};

var sendBeacon = function(tracker, settings, targetElement) {
  if (settings.type === 'page') {
    tracker.t();
  } else {
    var linkSettings = {
      linkType: settings.linkType || 'o',
      linkName: settings.linkName || getLinkName(targetElement)
    };

    logger.info(
      'Firing link track beacon for configuration "' +
      ' using the values: ' +
      JSON.stringify(linkSettings)
    );

    tracker.tl(
      isLink(targetElement) ? targetElement : 'true',
      linkSettings.linkType,
      linkSettings.linkName
    );
  }
};

module.exports = function(settings, targetElement) {
  var extensionConfigurations = getExtensionConfigurations();
  if (settings.extensionConfigurationIds) {
    extensionConfigurations = extensionConfigurations.filter(function(extensionsConfiguration) {
      return settings.extensionConfigurationIds.indexOf(extensionsConfiguration.id) !== -1;
    });
  }

  extensionConfigurations.forEach(function(configuration) {
    getTracker(configuration.id).then(function(tracker) {
      logger.info('Firing page view beacon for configuration "' + configuration.name + '".');
      sendBeacon(tracker, settings, targetElement);
    }, function(errorMessage) {
      logger.error(
        'Cannot send beacon for configuration "' +
        configuration.name +
        '": ' +
        errorMessage
      );
    });
  });
};
