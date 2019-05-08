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
import {connect} from 'react-redux';
import Checkbox from '@react/react-spectrum/Checkbox';
import Textfield from '@react/react-spectrum/Textfield';
import Heading from '@react/react-spectrum/Heading';
import {formValueSelector} from 'redux-form';
import WrappedField from './wrappedField';

import {mergeConfigs} from '../../utils/formConfigUtils';
import CharSet, {formConfig as charSetFormConfig} from './charSet';
import CurrencyCode, {formConfig as currencyCodeFormConfig} from './currencyCode';
import ENVIRONMENTS from '../../enums/environments';
import COMPONENT_NAMES from '../../enums/componentNames';

const General = props => (
  <div>
    <WrappedField name="euComplianceEnabled" component={ Checkbox }>
      Enable EU compliance for Adobe Analytics
    </WrappedField>

    {props.euComplianceEnabled ? (
      <div className="ColumnGrid">
        <label className="ColumnGrid-cell FieldSubset">
          <span className="Label">Tracking Cookie Name</span>
          <WrappedField
            name="trackingCookieName"
            component={ Textfield }
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
          <WrappedField
            name="trackerProperties.trackingServer"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>
      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">SSL Tracking Server</span>
        <div>
          <WrappedField
            name="trackerProperties.trackingServerSecure"
            component={ Textfield }
            componentClassName="Field--long"
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
    settingsToFormValues(values, settings, meta) {
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
        },
        orgId: meta.company.orgId
      };
    },
    formValuesToSettings(settings, values) {
      const {
        euComplianceEnabled,
        trackingCookieName,
        trackerProperties: { trackingServer, trackingServerSecure },
        orgId
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
        trackerProperties,
        orgId
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
          const multipleReportSuitesByComma = accountsForEnvironment.some((reportSuite) => {
            return reportSuite.includes(',');
          });
          const multipleReportSuites = accountsForEnvironment.length > 1;
          return multipleReportSuitesByComma || multipleReportSuites;
        });
      }

      if (trackingServersRequired) {
        const {
          trackingServer
        } = values.trackerProperties;

        if (!trackingServer) {
          trackerPropertiesErrors.trackingServer =
            'Please provide a tracking server';
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
