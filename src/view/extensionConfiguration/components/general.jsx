import React from 'react';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import mergeFormConfigs from '../../utils/mergeFormConfigs';
import openDataElementSelector from '../../utils/openDataElementSelector';
import CharSet, { formConfig as charSetFormConfig } from './charSet';
import CurrencyCode, { formConfig as currencyCodeFormConfig } from './currencyCode';
import ENVIRONMENTS from '../../enums/environments';

const dataCenterOptions = [
  {
    label: 'Default',
    value: 'default'
  },
  {
    label: 'San Jose',
    value: '112'
  },
  {
    label: 'Dallas',
    value: '122'
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

    return (
      <div>
        <Checkbox
          {...euComplianceEnabled}>
          Enable EU compliance for Adobe Analytics
        </Checkbox>
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
              type="trackingServer"
              error={trackingServer.touched && trackingServer.error}>
              <Textfield
                className="Field--long"
                {...trackingServer}/>
            </ValidationWrapper>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, trackingServer)}/>
          </div>
        </div>
        <div>
          <span className="Label u-gapTop">SSL Tracking Server</span>
          <div>
            <ValidationWrapper
              type="trackingServerSecure"
              error={trackingServerSecure.touched && trackingServerSecure.error}>
              <Textfield
                className="Field--long"
                {...trackingServerSecure}/>
            </ValidationWrapper>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, trackingServerSecure)}/>
          </div>
        </div>
        <div>
          <span className="Label u-gapTop">Data Center</span>
          <div>
            <Select
              placeholder="Select a data center"
              {...dc}
              options={dataCenterOptions}/>
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
    validate(errors, values = { libraryCode: {} }) {
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
