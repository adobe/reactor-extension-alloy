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
import { connect } from 'react-redux';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Heading from '@coralui/react-coral/lib/Heading';
import { Field, formValueSelector } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import { mergeConfigs } from '../../utils/formConfigUtils';
import CharSet, { formConfig as charSetFormConfig } from './charSet';
import CurrencyCode, {
  formConfig as currencyCodeFormConfig
} from './currencyCode';
import ENVIRONMENTS from '../../enums/environments';
import COMPONENT_NAMES from '../../enums/componentNames';

const General = props => (
  <div>
    <Field name="euComplianceEnabled" component={ Checkbox }>
      Enable EU compliance for Adobe Analytics
    </Field>

    {props.euComplianceEnabled ? (
      <div className="ColumnGrid">
        <label className="ColumnGrid-cell FieldSubset">
          <span className="Label">Tracking Cookie Name</span>
          <Field
            name="trackingCookieName"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            className="u-block"
            supportDataElement
          />
        </label>
      </div>
    ) : null}

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

export default connect(state => ({
  euComplianceEnabled: formValueSelector('default')(
    state,
    'euComplianceEnabled'
  )
}))(General);

export const formConfig = mergeConfigs(
  charSetFormConfig,
  currencyCodeFormConfig,
  {
    settingsToFormValues(values, settings) {
      let { trackingCookieName } = settings;

      const { trackingServer, trackingServerSecure } =
        settings.trackerProperties || {};

      let euComplianceEnabled = false;
      if (trackingCookieName) {
        euComplianceEnabled = true;
      } else {
        trackingCookieName = 'sat_track';
      }

      return {
        ...values,
        trackingCookieName,
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
        trackingCookieName,
        trackerProperties: { trackingServer, trackingServerSecure }
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

      const newSettings = {
        ...settings,
        trackingCookieName,
        trackerProperties
      };

      if (!euComplianceEnabled) {
        delete newSettings.trackingCookieName;
      }

      return newSettings;
    },
    validate(errors, values = { libraryCode: {} }) {
      const trackerPropertiesErrors = {
        ...errors.trackerProperties
      };

      let trackingServersRequired = false;

      const componentsWithErrors = errors.componentsWithErrors
        ? errors.componentsWithErrors.slice()
        : [];

      if (values.libraryCode && values.libraryCode.accounts) {
        const accounts = values.libraryCode.accounts;
        trackingServersRequired = ENVIRONMENTS.some((environment) => {
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
          trackerPropertiesErrors.trackingServer =
            'Please provide a tracking server';
        }

        if (!trackingServerSecure) {
          trackerPropertiesErrors.trackingServerSecure =
            'Please provide an SSL tracking server';
        }
      }

      let trackingCookieNameError;
      if (values.euComplianceEnabled && !values.trackingCookieName) {
        trackingCookieNameError = 'Please provide a tracking cookie name';
      }

      if (Object.keys(trackerPropertiesErrors).length) {
        componentsWithErrors.push(COMPONENT_NAMES.GENERAL);
      }

      return {
        ...errors,
        componentsWithErrors,
        trackingCookieName: trackingCookieNameError,
        trackerProperties: trackerPropertiesErrors
      };
    }
  }
);
