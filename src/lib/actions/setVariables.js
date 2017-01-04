'use strict';

var logger = require('@turbine/logger');

var getTracker = require('../helpers/getTracker');
var applyTrackerVariables = require('../helpers/applyTrackerVariables');

module.exports = function(settings, targetElement, event) {
  getTracker().then(function(tracker) {
    logger.info('Set variables on the tracker.');
    applyTrackerVariables(tracker, settings.trackerProperties);
    if (settings.customSetup && settings.customSetup.source) {
      settings.customSetup.source.call(targetElement, event, tracker);
    }
  }, function(errorMessage) {
    logger.error(
      'Cannot set variables: ' +
      errorMessage
    );
  });
};
