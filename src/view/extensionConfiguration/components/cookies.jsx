import React from 'react';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
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
          <Field
            name="trackerProperties.visitorID"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">Visitor Namespace</span>
        <div>
          <Field
            name="trackerProperties.visitorNamespace"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">Domain Periods</span>
        <div>
          <Field
            name="trackerProperties.cookieDomainPeriods"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label">First-party Domain Periods</span>
        <div>
          <Field
            name="trackerProperties.fpCookieDomainPeriods"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
    </div>
    <div>
      <label className="Label" htmlFor="cookieLifetimeField">Cookie Lifetime</label>
      <div>
        <Field
          id="cookieLifetimeField"
          name="trackerProperties.cookieLifetime"
          component={ Select }
          inputClassName="Cookies-cookieLifetime"
          className="u-gapRight"
          options={ cookieLifetimeOptions }
        />

        {
          cookieLifetime === COOKIE_LIFETIME_PERIODS.SECONDS ?
            <Field
              name="trackerProperties.cookieLifetimeSeconds"
              component={ DecoratedInput }
              inputComponent={ Textfield }
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

