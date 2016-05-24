'use strict';

var logger = require('logger');
var getExtensionConfigurations = require('get-extension-configurations');
var getTracker = require('../helpers/getTracker.js');

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
  var configurations = settings.extensionConfigurationIds ||
    Object.keys(getExtensionConfigurations());

  configurations.forEach(function(configurationId) {
    getTracker(configurationId).then(function(tracker) {
      logger.info('Firing page view beacon for configuration "' + configurationId + '".');
      sendBeacon(tracker, settings, targetElement);
    }, function(errorMessage) {
      logger.error(
        'Cannot send beacon for configuration "' +
        configurationId +
        '": ' +
        errorMessage
      );
    });
  });


};
