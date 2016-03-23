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
  settingsToFormValues: (values, options) => {
    const { settings } = options;

    values = {
      ...values
    };

    if (settings.hasOwnProperty('cookieLifetime') &&
        settings.cookieLifetime !== '' &&
        settings.cookieLifetime !== 'NONE' &&
        settings.cookieLifetime !== 'SESSION') {
      values.cookieLifetimeSeconds = settings.cookieLifetime;
      values.cookieLifetime = 'SECONDS';
    }

    if (!values.hasOwnProperty('cookieLifetime') || values.cookieLifetime === '') {
      values.cookieLifetime = 'DEFAULT'
    }

    return values;
  },
  formValuesToSettings: (settings, values) => {
    settings = {
      ...settings
    };

    switch (settings.cookieLifetime) {
      case 'SECONDS':
        settings.cookieLifetime = settings.cookieLifetimeSeconds || '';
        break;
      case 'DEFAULT':
        delete settings.cookieLifetime;
        break;
    }

    delete settings.cookieLifetimeSeconds;

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

