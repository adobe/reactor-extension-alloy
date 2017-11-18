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

// The Launch code version is a 4 characters string.  The first character will always be L
// followed by year, month, and day codes.
// For example: JS-1.4.3-L53O = JS 1.4.3 code, Launch 2015 March 24th release (revision 1)
// More info: https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=tagmanager&title=DTM+Analytics+Code+Versions

'use strict';

var THIRD_OF_DAY = 8; //hours

var getDayField = function(date) {
  return date.getUTCDate().toString(36);
};

var getLastChar = function(str) {
  return str.substr(str.length - 1);
};

var getRevision = function(date) {
  // We are under the assumption that a Turbine version will be release at least 8h apart (max 3
  // releases per day).
  return Math.floor(date.getUTCHours() / THIRD_OF_DAY);
};

var getMonthField = function(date) {
  var monthNumber = date.getUTCMonth() + 1;
  var revision = getRevision(date);

  var monthField = (monthNumber + revision * 12).toString(36);

  return getLastChar(monthField);
};

var getYearField = function(date) {
  return (date.getUTCFullYear() - 2010).toString(36);
};

module.exports = function(dateString) {
  var date = new Date(dateString);

  if (isNaN(date)) {
    throw new Error('Invalid date provided');
  }

  return ('L' + getYearField(date) + getMonthField(date) + getDayField(date)).toUpperCase();
};
