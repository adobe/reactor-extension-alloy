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
import Checkbox from '@react/react-spectrum/Checkbox';
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Textfield from '@react/react-spectrum/Textfield';
import Heading from '@react/react-spectrum/Heading';
import { connect } from 'react-redux';
import { formValueSelector, FieldArray } from 'redux-form';
import EditorButton from './editorButton';
import WrappedField from './wrappedField';
import ReportSuiteEditor from './reportSuitesEditor';
import InfoTip from './infoTip';
import ENVIRONMENTS from '../../enums/environments';
import COMPONENT_NAMES from '../../enums/componentNames';

import './libraryManagement.styl';

const LIB_TYPES = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

const ReportSuites = () => (
  <section>
    <Heading size="4">
      Report Suites
      <InfoTip>
        Specify one or more report suites to which your data should be sent.
      </InfoTip>
    </Heading>

    <section className="ReportSuites-fieldsContainer">
      <div className="ReportSuites-environment">
        <label className="Label">
          Development Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            development environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.development"
            component={ ReportSuiteEditor }
          />
        </div>
      </div>
      <div className="ReportSuites-environment">
        <label className="Label">
          Staging Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            staging environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.staging"
            component={ ReportSuiteEditor }
          />
        </div>
      </div>
      <div className="ReportSuites-environment">
        <label className="Label">
          Production Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            production environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.production"
            component={ ReportSuiteEditor }
          />
        </div>
      </div>
    </section>
  </section>
);

const TrackerVariableName = ({ className }) => (
  <div className={ className }>
    <label>
      <span className="Label">Tracker is accessible on the global variable named:</span>
      <WrappedField
        name="libraryCode.trackerVariableName"
        component={ Textfield }
        inputClassName="u-gapLeft"
      />
    </label>
  </div>
);

let OverwriteReportSuites = ({ className, showReportSuites }) => (
  <div className={ className }>
    <WrappedField
      name="libraryCode.showReportSuites"
      component={ Checkbox }
    >
      Set the following report suites on tracker
    </WrappedField>

    {
      showReportSuites && <ReportSuites />
    }
  </div>
);

OverwriteReportSuites = connect(
  state => ({
    showReportSuites: formValueSelector('default')(state, 'libraryCode.showReportSuites')
  })
)(OverwriteReportSuites);

const LibraryManagement = ({ type }) => (
  <div>
    <WrappedField
      vertical
      name="libraryCode.type"
      component={ RadioGroup }
    >
      <Radio
        name="libraryCode.type"
        type="radio"
        value={ LIB_TYPES.MANAGED }
      >
        Manage the library for me
      </Radio>

      <Radio
        name="libraryCode.type"
        type="radio"
        value={ LIB_TYPES.PREINSTALLED }
      >
        Use the library already installed on the page
      </Radio>
      <Radio
        name="libraryCode.type"
        type="radio"
        value={ LIB_TYPES.REMOTE }
      >
        Load the library from a custom URL
      </Radio>
      <Radio
        name="libraryCode.type"
        component={ Radio }
        type="radio"
        value={ LIB_TYPES.CUSTOM }
      >
        Let me provide custom library code
      </Radio>
    </WrappedField>
      {
        type === LIB_TYPES.MANAGED ?
          <div className="FieldSubset">
            <ReportSuites />
            <WrappedField
              name="libraryCode.scopeTrackerGlobally"
              component={ Checkbox }
            >
              Make tracker globally accessible
            </WrappedField>
            <InfoTip className="u-fieldLineHeight u-noPadding">
              If enabled the tracker will be scoped globally under <strong>window.s</strong>.
            </InfoTip>
          </div> : null
      },
      {
        type === LIB_TYPES.PREINSTALLED ?
          <div className="FieldSubset">
            <OverwriteReportSuites className="u-gapBottom" />
            <TrackerVariableName />
          </div> : null
      },
      {
        type === LIB_TYPES.REMOTE ?
          <div className="FieldSubset">
            <div className="u-gapBottom">
              <label>
                <span className="Label">HTTP URL:</span>
                <div>
                  <WrappedField
                    name="libraryCode.httpUrl"
                    component={ Textfield }
                    inputClassName="Field--long"
                    supportDataElement
                  />
                </div>
              </label>
              <label>
                <span className="Label u-gapTop">HTTPS URL:</span>
                <div>
                  <WrappedField
                    name="libraryCode.httpsUrl"
                    component={ Textfield }
                    inputClassName="Field--long"
                    supportDataElement
                  />
                </div>
              </label>
            </div>
            <OverwriteReportSuites className="u-block u-gapBottom" />
            <TrackerVariableName className="u-block u-gapBottom" />
          </div> : null
      },
      {
        type === LIB_TYPES.CUSTOM ?
          <div className="FieldSubset">
            <div className="u-gapBottom">
              <WrappedField
                name="libraryCode.source"
                component={ EditorButton }
              />
            </div>
            <OverwriteReportSuites className="u-block u-gapBottom" />
            <TrackerVariableName className="u-block u-gapBottom" />
          </div> : null
      }
  </div>
);

export default connect(
  state => ({
    type: formValueSelector('default')(state, 'libraryCode.type')
  })
)(LibraryManagement);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const libraryCode = settings.libraryCode || {};

    const {
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source,
      scopeTrackerGlobally
    } = libraryCode;

    const showReportSuites = Boolean(type !== LIB_TYPES.MANAGED && libraryCode.accounts);

    const accounts = libraryCode.accounts || {};
    accounts.production = accounts.production || [''];
    accounts.staging = accounts.staging || [''];
    accounts.development = accounts.development || [''];

    return {
      ...values,
      libraryCode: {
        type: type || LIB_TYPES.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        accounts,
        showReportSuites,
        httpUrl,
        httpsUrl,
        source,
        scopeTrackerGlobally
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source,
      showReportSuites,
      scopeTrackerGlobally
    } = values.libraryCode || {};

    const libraryCodeSettings = {
      type
    };

    const exportReportSuites = showReportSuites || type === LIB_TYPES.MANAGED;
    if (exportReportSuites && values.libraryCode.accounts) {
      const accounts = {};

      ENVIRONMENTS.forEach((environment) => {
        const accountsForEnvironment = values.libraryCode.accounts[environment]
          .filter(account => account);

        if (accountsForEnvironment.length > 0) {
          accounts[environment] = accountsForEnvironment;
        }
      });

      if (Object.keys(accounts).length) {
        libraryCodeSettings.accounts = accounts;
      }

      libraryCodeSettings.scopeTrackerGlobally = scopeTrackerGlobally;
    }

    if (type !== LIB_TYPES.MANAGED) {
      libraryCodeSettings.trackerVariableName = trackerVariableName;
    }

    if (type === LIB_TYPES.REMOTE) {
      libraryCodeSettings.httpUrl = httpUrl;
      libraryCodeSettings.httpsUrl = httpsUrl;
    }

    if (type === LIB_TYPES.CUSTOM) {
      libraryCodeSettings.source = source;
    }

    return {
      ...settings,
      libraryCode: libraryCodeSettings
    };
  },
  validate(errors, values) {
    const {
      accounts = {},
      showReportSuites,
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source
    } = values.libraryCode || {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    const libraryCodeErrors = {};

    const reportSuitesAreRequired =
      (type !== LIB_TYPES.MANAGED && showReportSuites) || type === LIB_TYPES.MANAGED;
    const productionAccountsAreMissing = !accounts.production ||
      accounts.production.filter(account => account).length === 0;
    if (reportSuitesAreRequired && productionAccountsAreMissing) {
      libraryCodeErrors.accounts = {
        production: ['Please specify a production report suite']
      };
    }

    if (type !== LIB_TYPES.MANAGED && !trackerVariableName) {
      libraryCodeErrors.trackerVariableName = 'Please specify a variable name';
    }

    if (type === LIB_TYPES.REMOTE) {
      if (!httpUrl) {
        libraryCodeErrors.httpUrl = 'Please specify an HTTP URL';
      }

      if (!httpsUrl) {
        libraryCodeErrors.httpsUrl = 'Please specify an HTTPS URL';
      }
    }

    if (type === LIB_TYPES.CUSTOM && !source) {
      libraryCodeErrors.source = 'Please provide custom code';
    }

    if (Object.keys(libraryCodeErrors).length) {
      componentsWithErrors.push(COMPONENT_NAMES.LIBRARY_MANAGEMENT);
    }

    return {
      ...errors,
      componentsWithErrors,
      libraryCode: libraryCodeErrors
    };
  }
};
