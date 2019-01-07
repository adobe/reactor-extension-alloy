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

import React from 'react';
import Textfield from '@react/react-spectrum/Textfield';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from './wrappedField';
import RestrictedComboBox from './restrictedComboBox';
import COMPONENT_NAMES from '../../enums/componentNames';

import './cookies.styl';

const COOKIE_LIFETIME_PERIODS = {
  DEFAULT: 'DEFAULT',
  NONE: 'NONE',
  SESSION: 'SESSION',
  SECONDS: 'SECONDS'
};

const cookieLifetimeOptions = [{
  label: 'Default',
  value: COOKIE_LIFETIME_PERIODS.DEFAULT
}, {
  label: 'None',
  value: COOKIE_LIFETIME_PERIODS.NONE
}, {
  label: 'Session',
  value: COOKIE_LIFETIME_PERIODS.SESSION
}, {
  label: 'Seconds',
  value: COOKIE_LIFETIME_PERIODS.SECONDS
}];

const Cookies = ({ cookieLifetime }) => (
  <div>
    <div className="ColumnGrid">
      <label className="ColumnGrid-cell">
        <span className="Label">Visitor ID</span>
        <div>
          <WrappedField
            name="trackerProperties.visitorID"
            component={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">Visitor Namespace</span>
        <div>
          <WrappedField
            name="trackerProperties.visitorNamespace"
            component={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">Domain Periods</span>
        <div>
          <WrappedField
            name="trackerProperties.cookieDomainPeriods"
            component={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">First-party Domain Periods</span>
        <div>
          <WrappedField
            name="trackerProperties.fpCookieDomainPeriods"
            component={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
    </div>
    <div>
      <label className="Label" htmlFor="cookieLifetimeField">Cookie Lifetime</label>
      <div>
        <WrappedField
          id="cookieLifetimeField"
          name="trackerProperties.cookieLifetime"
          component={ RestrictedComboBox }
          inputClassName="Cookies-cookieLifetime"
          className="u-gapRight"
          options={ cookieLifetimeOptions }
        />

        {
          cookieLifetime === COOKIE_LIFETIME_PERIODS.SECONDS ?
            <WrappedField
              name="trackerProperties.cookieLifetimeSeconds"
              component={ RestrictedComboBox }
              inputClassName="Cookies-cookieLifetimeSeconds"
              supportDataElement
            /> : null
        }
      </div>
    </div>
  </div>
);

export default connect(
  state => ({
    cookieLifetime: formValueSelector('default')(state, 'trackerProperties.cookieLifetime')
  })
)(Cookies);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = settings.trackerProperties || {};

    const trackerProperties = {
      ...values.trackerProperties,
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods
    };

    if (cookieLifetime) {
      switch (cookieLifetime) {
        case COOKIE_LIFETIME_PERIODS.NONE:
        case COOKIE_LIFETIME_PERIODS.SESSION:
          trackerProperties.cookieLifetime = cookieLifetime;
          break;
        default:
          trackerProperties.cookieLifetimeSeconds = cookieLifetime;
          trackerProperties.cookieLifetime = COOKIE_LIFETIME_PERIODS.SECONDS;
      }
    }

    return {
      ...values,
      trackerProperties
    };
  },
  formValuesToSettings(settings, values) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime,
      cookieLifetimeSeconds
    } = values.trackerProperties || {};

    const trackerProperties = {
      ...settings.trackerProperties
    };

    if (visitorID) {
      trackerProperties.visitorID = visitorID;
    }

    if (visitorNamespace) {
      trackerProperties.visitorNamespace = visitorNamespace;
    }

    if (cookieDomainPeriods) {
      trackerProperties.cookieDomainPeriods = cookieDomainPeriods;
    }

    if (fpCookieDomainPeriods) {
      trackerProperties.fpCookieDomainPeriods = fpCookieDomainPeriods;
    }

    switch (cookieLifetime) {
      case COOKIE_LIFETIME_PERIODS.NONE:
      case COOKIE_LIFETIME_PERIODS.SESSION:
        trackerProperties.cookieLifetime = cookieLifetime;
        break;
      case COOKIE_LIFETIME_PERIODS.SECONDS:
        if (cookieLifetimeSeconds && cookieLifetimeSeconds.trim().length > 0) {
          trackerProperties.cookieLifetime = cookieLifetimeSeconds.trim();
        }
        break;
    }

    return {
      ...settings,
      trackerProperties
    };
  },
  validate(errors, values) {
    const { cookieLifetime, cookieLifetimeSeconds } = values.trackerProperties || {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    if (cookieLifetime === COOKIE_LIFETIME_PERIODS.SECONDS &&
      (!cookieLifetimeSeconds || cookieLifetimeSeconds.trim().length === 0)) {
      errors = {
        ...errors,
        trackerProperties: {
          ...errors.trackerProperties,
          cookieLifetimeSeconds: 'Please provide the number of seconds for the cookie lifetime'
        }
      };
    }

    if (errors.trackerProperties && errors.trackerProperties.cookieLifetimeSeconds) {
      componentsWithErrors.push(COMPONENT_NAMES.COOKIES);
    }

    return {
      ...errors,
      componentsWithErrors
    };
  }
};

