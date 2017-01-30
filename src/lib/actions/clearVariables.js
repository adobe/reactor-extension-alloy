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
