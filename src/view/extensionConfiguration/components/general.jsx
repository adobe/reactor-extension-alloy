import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Heading from '@coralui/react-coral/lib/Heading';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import { mergeConfigs } from '../../utils/formConfigUtils';
import CharSet, { formConfig as charSetFormConfig } from './charSet';
import CurrencyCode, { formConfig as currencyCodeFormConfig } from './currencyCode';
import ENVIRONMENTS from '../../enums/environments';

export default () => (
  <div>
    <Field
      name="euComplianceEnabled"
      component={ Checkbox }
    >
      Enable EU compliance for Adobe Analytics
    </Field>
    <div className="ColumnGrid">
      <div className="ColumnGrid-cell">
        <Heading size="4">Character Set</Heading>
        <CharSet />
      </div>
      <div className="ColumnGrid-cell">
        <Heading size="4">Currency Code</Heading>
        <CurrencyCode />
      </div>
      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Tracking Server</span>
        <div>
          <Field
            name="trackerProperties.trackingServer"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">SSL Tracking Server</span>
        <div>
          <Field
            name="trackerProperties.trackingServerSecure"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
    </div>
  </div>
);

export const formConfig = mergeConfigs(
  charSetFormConfig,
  currencyCodeFormConfig,
  {
    settingsToFormValues(values, settings) {
      const {
        euComplianceEnabled
      } = settings;

      const {
        trackingServer,
        trackingServerSecure
      } = settings.trackerProperties || {};

      return {
        ...values,
        euComplianceEnabled,
        trackerProperties: {
          ...values.trackerProperties,
          trackingServer,
          trackingServerSecure
        }
      };
    },
    formValuesToSettings(settings, values) {
      const {
        euComplianceEnabled,
        trackerProperties: {
          trackingServer,
          trackingServerSecure
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
          const accountsForEnvironment = accounts[environment];
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
