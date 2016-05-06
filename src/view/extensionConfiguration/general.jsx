import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../utils/openDataElementSelector';
import CharSet, { formConfig as charSetFormConfig } from './components/charSet';
import CurrencyCode, { formConfig as currencyCodeFormConfig } from './components/currencyCode';
import ENVIRONMENTS from '../enums/environments';

// Array instead of object because order is important.
const DATA_CENTERS = [
  {
    value: 'default',
    label: 'Default'
  },
  {
    value: 112,
    label: 'San Jose'
  },
  {
    value: 122,
    label: 'Dallas'
  }
];

const DATA_CENTER_DEFAULT = 'default';

export default class General extends React.Component {
  render() {
    const {
      euComplianceEnabled,
      trackerProperties: {
        trackingServer,
        trackingServerSecure,
        dc
      }
    } = this.props.fields;

    const dataCenterOptions = DATA_CENTERS.map(dataCenter => {
      return (
        <Coral.Select.Item
          key={dataCenter.value}
          value={dataCenter.value}>
          {dataCenter.label}
        </Coral.Select.Item>
      );
    });

    return (
      <div>
        <Coral.Checkbox {...euComplianceEnabled}>Enable EU compliance for Adobe Analytics</Coral.Checkbox>
        <div>
          <h4 className="coral-Heading coral-Heading--4 u-gapTop">Character Set</h4>
          <CharSet fields={this.props.fields}/>
        </div>
        <div>
          <h4 className="coral-Heading coral-Heading--4 u-gapTop">Currency Code</h4>
          <CurrencyCode fields={this.props.fields}/>
        </div>
        <div>
          <span className="Label u-gapTop">Tracking Server</span>
          <div>
            <ValidationWrapper
              error={trackingServer.touched && trackingServer.error}>
              <Coral.Textfield className="Field--large" {...trackingServer}/>
            </ValidationWrapper>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, trackingServer)}/>
          </div>
        </div>
        <div>
          <span className="Label u-gapTop">SSL Tracking Server</span>
          <div>
            <ValidationWrapper
              error={trackingServerSecure.touched && trackingServerSecure.error}>
              <Coral.Textfield className="Field--large" {...trackingServerSecure}/>
            </ValidationWrapper>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, trackingServerSecure)}/>
          </div>
        </div>
        <div>
          <span className="Label u-gapTop">Data Center</span>
          <div>
            <Coral.Select {...dc} placeholder="Select a data center">
              {dataCenterOptions}
            </Coral.Select>
          </div>
        </div>
      </div>
    );
  }
}

export const formConfig = mergeFormConfigs(
  charSetFormConfig,
  currencyCodeFormConfig,
  {
    fields: [
      'euComplianceEnabled',
      'trackerProperties.trackingServer',
      'trackerProperties.trackingServerSecure',
      'trackerProperties.dc'
    ],
    settingsToFormValues(values, options) {
      const {
        euComplianceEnabled
      } = options.settings;

      const {
        trackingServer,
        trackingServerSecure,
        dc
      } = options.settings.trackerProperties || {};

      return {
        ...values,
        euComplianceEnabled,
        trackerProperties: {
          ...values.trackerProperties,
          trackingServer,
          trackingServerSecure,
          dc: dc || DATA_CENTER_DEFAULT
        }
      };
    },
    formValuesToSettings(settings, values) {
      const {
        euComplianceEnabled,
        trackerProperties: {
          trackingServer,
          trackingServerSecure,
          dc
        }
      } = values;

      const trackerProperties = {
        ...settings.trackerProperties
      };

      if (trackingServer) {
        trackerProperties.trackingServer = trackingServer;
      }

      if (trackingServerSecure) {
        trackerProperties.trackingServerSecure = trackingServerSecure;
      }

      if (dc && dc !== DATA_CENTER_DEFAULT) {
        trackerProperties.dc = dc;
      }

      return {
        ...settings,
        euComplianceEnabled,
        trackerProperties
      };
    },
    validate(errors, values) {
      const trackerPropertiesErrors = {
        ...errors.trackerProperties
      };

      let trackingServersRequired = false;

      if (values.libraryCode && values.libraryCode.accounts) {
        const accounts = values.libraryCode.accounts;
        trackingServersRequired = ENVIRONMENTS.some(environment => {
          let accountsForEnvironment = accounts[environment];
          return accountsForEnvironment && accountsForEnvironment.length > 1;
        });
      }

      if (trackingServersRequired) {
        const {
          trackingServer,
          trackingServerSecure
        } = values.trackerProperties;

        if (!trackingServer) {
          trackerPropertiesErrors.trackingServer = 'Please provide a tracking server';
        }

        if (!trackingServerSecure) {
          trackerPropertiesErrors.trackingServerSecure = 'Please provide an SSL tracking server';
        }
      }

      return {
        ...errors,
        trackerProperties: trackerPropertiesErrors
      };
    }
  });
