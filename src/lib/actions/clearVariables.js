'use strict';

var logger = require('@turbine/logger');
var getTracker = require('../helpers/getTracker');

module.exports = function() {
  getTracker().then(function(tracker) {
    if (tracker.clearVars) {
      logger.info('Clear variables.');
      tracker.clearVars();
    }
  }, function(errorMessage) {
    logger.error(
      'Cannot clear variables: ' +
      errorMessage
    );
  });
};
