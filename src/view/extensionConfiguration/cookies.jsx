import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import { isNumber } from '../utils/validators';

export default class Cookies extends React.Component {
  render() {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID,
      cookieLifetime,
      cookieLifetimeSeconds
    } = this.props.fields;

    return (
      <div>
        <label>
          Visitor Id
          <Coral.Textfield {...visitorID}/>
        </label>
        <label>
          Visitor Namespace
          <Coral.Textfield {...visitorNamespace}/>
        </label>
        <label>
          Domain Periods
          <Coral.Textfield {...cookieDomainPeriods}/>
        </label>
        <label>
          First-party Domain Periods
          <Coral.Textfield {...fpCookieDomainPeriods}/>
        </label>
        <label>
          Transaction ID
          <Coral.Textfield {...transactionID}/>
        </label>
        <label>
          Cookie Lifetime
          <Coral.Select {...cookieLifetime}>
            <Coral.Select.Item value="DEFAULT">Default</Coral.Select.Item>
            <Coral.Select.Item value="NONE">None</Coral.Select.Item>
            <Coral.Select.Item value="SESSION">Session</Coral.Select.Item>
            <Coral.Select.Item value="SECONDS">Seconds</Coral.Select.Item>
          </Coral.Select>
        </label>
        {
          cookieLifetime.value === 'SECONDS' ?
            <ValidationWrapper error={cookieLifetimeSeconds.touched && cookieLifetimeSeconds.error}>
              <Coral.Textfield {...cookieLifetimeSeconds}/>
            </ValidationWrapper> : null
        }
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'visitorID',
    'visitorNamespace',
    'cookieDomainPeriods',
    'fpCookieDomainPeriods',
    'transactionID',
    'cookieLifetime',
    'cookieLifetimeSeconds'
  ],
  settingsToFormValues(values, options) {
    const { settings } = options;

    values = {
      ...values,
      visitorID: settings.visitorID,
      visitorNamespace: settings.visitorNamespace,
      cookieDomainPeriods: settings.cookieDomainPeriods,
      fpCookieDomainPeriods: settings.fpCookieDomainPeriods,
      transactionID: settings.transactionID
    };

    if (settings.hasOwnProperty('cookieLifetime') && settings.cookieLifetime.trim() !== '') {
      switch (settings.cookieLifetime) {
        case 'NONE':
        case 'SESSION':
          values.cookieLifetime = settings.cookieLifetime;
          break;
        default:
          values.cookieLifetimeSeconds = settings.cookieLifetime;
          values.cookieLifetime = 'SECONDS';
      }
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings,
      visitorID: values.visitorID,
      visitorNamespace: values.visitorNamespace,
      cookieDomainPeriods: values.cookieDomainPeriods,
      fpCookieDomainPeriods: values.fpCookieDomainPeriods,
      transactionID: values.transactionID
    };

    switch (values.cookieLifetime) {
      case 'NONE':
      case 'SESSION':
        settings.cookieLifetime = values.cookieLifetime;
        break;
      case 'SECONDS':
        if (values.cookieLifetimeSeconds && values.cookieLifetimeSeconds.trim().length > 0) {
          settings.cookieLifetime = values.cookieLifetimeSeconds.trim();
        }
        break;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };

    if (values.cookieLifetime === 'SECONDS' && !isNumber(values.cookieLifetimeSeconds)) {
      errors.cookieLifetimeSeconds = 'Please specify a number of seconds.';
    }

    return errors;
  }
};

