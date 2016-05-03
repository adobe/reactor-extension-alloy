import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../utils/openDataElementSelector';

const cookieLifetimePeriod = {
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
      transactionID,
      cookieLifetime,
      cookieLifetimeSeconds
    } = this.props.fields.trackerProperties;

    return (
      <div className="Cookies">
        <div className="Cookies-column">
          <label>
            <span className="Label">Visitor ID</span>
            <div>
              <Coral.Textfield className="Cookies-field" {...visitorID}/>
              <DataElementSelectorButton
                onClick={openDataElementSelector.bind(this, visitorID)}/>
            </div>
          </label>
          <label>
            <span className="Label u-gapTop">Domain Periods</span>
            <div>
              <Coral.Textfield className="Cookies-field" {...cookieDomainPeriods}/>
              <DataElementSelectorButton
                onClick={openDataElementSelector.bind(this, cookieDomainPeriods)}/>
            </div>
          </label>
          <label>
            <span className="Label u-gapTop">Transaction ID</span>
            <div>
              <Coral.Textfield className="Cookies-field" {...transactionID}/>
              <DataElementSelectorButton
                onClick={openDataElementSelector.bind(this, transactionID)}/>
            </div>
          </label>
        </div>
        <div className="Cookies-column">
          <label>
            <span className="Label">Visitor Namespace</span>
            <div>
              <Coral.Textfield className="Cookies-field" {...visitorNamespace}/>
              <DataElementSelectorButton
                onClick={openDataElementSelector.bind(this, visitorNamespace)}/>
            </div>
          </label>
          <label>
            <span className="Label u-gapTop">First-party Domain Periods</span>
            <div>
              <Coral.Textfield className="Cookies-field" {...fpCookieDomainPeriods}/>
              <DataElementSelectorButton
                onClick={openDataElementSelector.bind(this, fpCookieDomainPeriods)}/>
            </div>
          </label>
          <label>
            <span className="Label u-gapTop">Cookie Lifetime</span>
            <div>
              <Coral.Select className="Cookies-cookieLifetime u-gapRight" {...cookieLifetime}>
                <Coral.Select.Item value={cookieLifetimePeriod.DEFAULT}>Default</Coral.Select.Item>
                <Coral.Select.Item value={cookieLifetimePeriod.NONE}>None</Coral.Select.Item>
                <Coral.Select.Item value={cookieLifetimePeriod.SESSION}>Session</Coral.Select.Item>
                <Coral.Select.Item value={cookieLifetimePeriod.SECONDS}>Seconds</Coral.Select.Item>
              </Coral.Select>
              {
                cookieLifetime.value === cookieLifetimePeriod.SECONDS ?
                  <ValidationWrapper
                      error={cookieLifetimeSeconds.touched && cookieLifetimeSeconds.error}>
                    <Coral.Textfield className="Cookies-cookieLifetimeSeconds"
                      {...cookieLifetimeSeconds}/>
                    <DataElementSelectorButton
                      onClick={openDataElementSelector.bind(this, cookieLifetimeSeconds)}/>
                  </ValidationWrapper> : null
              }
             </div>
          </label>
        </div>
      </div>
    );
  }
}

export const formConfig = createFormConfig({
  fields: [
    'trackerProperties.visitorID',
    'trackerProperties.visitorNamespace',
    'trackerProperties.cookieDomainPeriods',
    'trackerProperties.fpCookieDomainPeriods',
    'trackerProperties.transactionID',
    'trackerProperties.cookieLifetime',
    'trackerProperties.cookieLifetimeSeconds'
  ],
  settingsToFormValues(values, options) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID,
      cookieLifetime
    } = options.settings.trackerProperties || {};

    let trackerProperties = values.trackerProperties || {};

    trackerProperties = {
      ...trackerProperties,
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID
    };

    if (cookieLifetime) {
      switch (cookieLifetime) {
        case cookieLifetimePeriod.NONE:
        case cookieLifetimePeriod.SESSION:
          trackerProperties.cookieLifetime = cookieLifetime;
          break;
        default:
          trackerProperties.cookieLifetimeSeconds = cookieLifetime;
          trackerProperties.cookieLifetime = cookieLifetimePeriod.SECONDS;
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
      transactionID,
      cookieLifetime,
      cookieLifetimeSeconds
    } = values.trackerProperties;

    let trackerProperties = settings.trackerProperties || {};

    trackerProperties = {
      ...trackerProperties
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

    if (transactionID) {
      trackerProperties.transactionID = transactionID;
    }

    switch (cookieLifetime) {
      case cookieLifetimePeriod.NONE:
      case cookieLifetimePeriod.SESSION:
        trackerProperties.cookieLifetime = cookieLifetime;
        break;
      case cookieLifetimePeriod.SECONDS:
        if (cookieLifetimeSeconds && cookieLifetimeSeconds.trim().length > 0) {
          trackerProperties.cookieLifetime = cookieLifetimeSeconds.trim();
        }
        break;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
});

