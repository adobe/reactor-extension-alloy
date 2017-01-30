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

/**
 * The max number of dimensions and metrics based on the account level.
 */
const LIMITS = {
  eVar: {
    POINT_PRODUCT: 75,
    STANDARD: 100,
    PREMIUM: 250
  },
  prop: {
    POINT_PRODUCT: 75,
    STANDARD: 75,
    PREMIUM: 75
  },
  event: {
    POINT_PRODUCT: 100,
    STANDARD: 1000,
    PREMIUM: 1000
  }
};

export const LIMITS_LEVELS_LABELS = {
  POINT_PRODUCT: '',
  STANDARD: 'Standard',
  PREMIUM: 'Premium'
};

export const maxLevel = type => Math.max(...Object.keys(LIMITS[type]).map(e => LIMITS[type][e]));

export default LIMITS;
