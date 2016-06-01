import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../../utils/openDataElementSelector';

const COOKIE_LIFETIME_PERIODS = {
  DEFAULT: 'DEFAULT',
  NONE: 'NONE',
  SESSION: 'SESSION',
  SECONDS: 'SECONDS'
};

export default class Cookies extends React.Component {
  render() {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime,
      cookieLifetimeSeconds
    } = this.props.fields.trackerProperties;

    return (
      <div className='Cookies'>
        <label className='Cookies-field'>
          <span className='Label'>Visitor ID</span>
          <div>
            <Coral.Textfield ref='visitorIDTextfield' className='Field--long' {...visitorID}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, visitorID)}/>
          </div>
        </label>
        <label className='Cookies-field'>
          <span className='Label'>Visitor Namespace</span>
          <div>
            <Coral.Textfield
              ref='visitorNamespaceTextfield'
              className='Field--long'
              {...visitorNamespace}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, visitorNamespace)}/>
          </div>
        </label>
        <label className='Cookies-field'>
          <span className='Label'>Domain Periods</span>
          <div>
            <Coral.Textfield
              ref='cookieDomainPeriodsTextfield'
              className='Field--long'
              {...cookieDomainPeriods}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, cookieDomainPeriods)}/>
          </div>
        </label>
        <label className='Cookies-field'>
          <span className='Label'>First-party Domain Periods</span>
          <div>
            <Coral.Textfield
              ref='fpCookieDomainPeriodsTextfield'
              className='Field--long'
              {...fpCookieDomainPeriods}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, fpCookieDomainPeriods)}/>
          </div>
        </label>
        <div className='Cookies-field'>
          <label className='Label' htmlFor='cookieLifetimeField'>Cookie Lifetime</label>
          <div>
            <Coral.Select
              ref='cookieLifetimeSelect'
              className='Cookies-cookieLifetime u-gapRight'
              {...cookieLifetime}>
              <Coral.Select.Item value={COOKIE_LIFETIME_PERIODS.DEFAULT}>Default</Coral.Select.Item>
              <Coral.Select.Item value={COOKIE_LIFETIME_PERIODS.NONE}>None</Coral.Select.Item>
              <Coral.Select.Item value={COOKIE_LIFETIME_PERIODS.SESSION}>Session</Coral.Select.Item>
              <Coral.Select.Item value={COOKIE_LIFETIME_PERIODS.SECONDS}>Seconds</Coral.Select.Item>
            </Coral.Select>
            {
              cookieLifetime.value === COOKIE_LIFETIME_PERIODS.SECONDS ?
                <ValidationWrapper
                    ref='cookieLifetimeSecondsWrapper'
                    error={cookieLifetimeSeconds.touched && cookieLifetimeSeconds.error}>
                  <Coral.Textfield
                    ref='cookieLifetimeSecondsTextfield'
                    className='Cookies-cookieLifetimeSeconds'
                    {...cookieLifetimeSeconds}/>
                  <DataElementSelectorButton
                    onClick={openDataElementSelector.bind(this, cookieLifetimeSeconds)}/>
                </ValidationWrapper> : null
            }
           </div>
        </div>
      </div>
    );
  }
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
  validate(errors, values) {
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

