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
    logger.info('Firing page view beacon.');
    tracker.t();
  } else {
    var linkSettings = {
      linkType: settings.linkType || 'o',
      linkName: settings.linkName || getLinkName(targetElement)
    };

    logger.info(
      'Firing link track beacon using the values: ' +
      JSON.stringify(linkSettings) + '.'
    );

    tracker.tl(
      isLink(targetElement) ? targetElement : 'true',
      linkSettings.linkType,
      linkSettings.linkName
    );
  }
};

module.exports = function(settings, targetElement) {
  getTracker().then(function(tracker) {
    sendBeacon(tracker, settings, targetElement);
  }, function(errorMessage) {
    logger.error(
      'Cannot send beacon: ' +
      errorMessage
    );
  });
};
