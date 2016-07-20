import React from 'react';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import openDataElementSelector from '../../utils/openDataElementSelector';

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

export default function Cookies({ ...props }) {
  const {
    visitorID,
    visitorNamespace,
    cookieDomainPeriods,
    fpCookieDomainPeriods,
    cookieLifetime,
    cookieLifetimeSeconds
  } = props.fields.trackerProperties;

  return (
    <div className="Cookies">
      <label className="Cookies-field">
        <span className="Label">Visitor ID</span>
        <div>
          <Textfield className="Field--long" { ...visitorID } />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, visitorID) }
          />
        </div>
      </label>
      <label className="Cookies-field">
        <span className="Label">Visitor Namespace</span>
        <div>
          <Textfield
            className="Field--long"
            { ...visitorNamespace }
          />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, visitorNamespace) }
          />
        </div>
      </label>
      <label className="Cookies-field">
        <span className="Label">Domain Periods</span>
        <div>
          <Textfield
            className="Field--long"
            { ...cookieDomainPeriods }
          />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, cookieDomainPeriods) }
          />
        </div>
      </label>
      <label className="Cookies-field">
        <span className="Label">First-party Domain Periods</span>
        <div>
          <Textfield
            className="Field--long"
            { ...fpCookieDomainPeriods }
          />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, fpCookieDomainPeriods) }
          />
        </div>
      </label>
      <div className="u-gapBottom">
        <label className="Label" htmlFor="cookieLifetimeField">Cookie Lifetime</label>
        <div>
          <Select
            className="Cookies-cookieLifetime u-gapRight"
            { ...cookieLifetime }
            options={ cookieLifetimeOptions }
          />
          {
            cookieLifetime.value === COOKIE_LIFETIME_PERIODS.SECONDS ?
              <ValidationWrapper
                error={ cookieLifetimeSeconds.touched && cookieLifetimeSeconds.error }
              >
                <Textfield
                  className="Cookies-cookieLifetimeSeconds"
                  { ...cookieLifetimeSeconds }
                />
                <DataElementSelectorButton
                  onClick={ openDataElementSelector.bind(this, cookieLifetimeSeconds) }
                />
              </ValidationWrapper> : null
          }
        </div>
      </div>
    </div>
  );
}

export const formConfig = {
  fields: [
    'trackerProperties.visitorID',
    'trackerProperties.visitorNamespace',
    'trackerProperties.cookieDomainPeriods',
    'trackerProperties.fpCookieDomainPeriods',
    'trackerProperties.cookieLifetime',
    'trackerProperties.cookieLifetimeSeconds'
  ],
  settingsToFormValues(values, options) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = options.settings.trackerProperties || {};

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
  validate(errors, values = { trackerProperties: {} }) {
    const { cookieLifetime, cookieLifetimeSeconds } = values.trackerProperties;

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

    return errors;
  }
};

