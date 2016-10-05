import React from 'react';
import { InfoTip } from '@reactor/react-components';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Heading from '@coralui/react-coral/lib/Heading';
import { connect } from 'react-redux';
import { formValueSelector, Field } from 'redux-form';

import ENVIRONMENTS from '../../enums/environments';
import ReportSuite from './reportSuite';
import CodeField from '../../components/codeField';
import CoralField from '../../components/coralField';

import './libraryManagement.styl';

const LIB_TYPES = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

const LOAD_PHASES = {
  PAGE_TOP: 'pageTop',
  PAGE_BOTTOM: 'pageBottom'
};

const ReportSuites = () => (
  <section className="ReportSuites-container">
    <Heading size="4">
      Report Suites
      <InfoTip>Some tooltip</InfoTip>
    </Heading>

    <section className="ReportSuites-fieldsContainer">
      <Field
        name="libraryCode.accounts.production"
        label="Production Report Suite(s)"
        component={ ReportSuite }
      />

      <Field
        name="libraryCode.accounts.staging"
        label="Staging Report Suite(s)"
        component={ ReportSuite }
      />

      <Field
        name="libraryCode.accounts.development"
        label="Development Report Suite(s)"
        component={ ReportSuite }
      />
    </section>
  </section>
);

const LoadPhase = ({ className }) => (
  <div className={ className }>
    <fieldset>
      <legend><span className="Label">Load library at:</span></legend>
      <div>
        <CoralField
          name="libraryCode.loadPhase"
          component={ Radio }
          value={ LOAD_PHASES.PAGE_TOP }
        >
          Page Top
        </CoralField>

        <CoralField
          name="libraryCode.loadPhase"
          component={ Radio }
          value={ LOAD_PHASES.PAGE_BOTTOM }
        >
          Page Bottom
        </CoralField>
      </div>
    </fieldset>
  </div>
);

const TrackerVariableName = ({ className }) => (
  <div className={ className }>
    <label>
      <span className="Label">Tracker is accessible on the global variable named:</span>
      <CoralField
        name="libraryCode.trackerVariableName"
        component={ Textfield }
        componentClassName="u-gapLeft"
        supportValidation
      />
    </label>
  </div>
);

let OverwriteReportSuites = ({ className, showReportSuites }) => (
  <div className={ className }>
    <CoralField
      name="libraryCode.showReportSuites"
      component={ Checkbox }
    >
      Set the following report suites on tracker
    </CoralField>

    {
      showReportSuites ? <ReportSuites /> : null
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
    <CoralField
      name="libraryCode.type"
      component={ Radio }
      value={ LIB_TYPES.MANAGED }
    >
      Manage the library for me
    </CoralField>

    {
      type === LIB_TYPES.MANAGED ?
        <div className="FieldSubset">
          <ReportSuites />
          <LoadPhase />
        </div> : null
    }

    <div>
      <CoralField
        name="libraryCode.type"
        component={ Radio }
        value={ LIB_TYPES.PREINSTALLED }
      >
        Use the library already installed on the page
      </CoralField>
    </div>
    {
      type === LIB_TYPES.PREINSTALLED ?
        <div className="FieldSubset">
          <OverwriteReportSuites className="u-gapBottom" />
          <TrackerVariableName />
        </div> : null
    }

    <div>
      <CoralField
        name="libraryCode.type"
        component={ Radio }
        value={ LIB_TYPES.REMOTE }
      >
        Load the library from a custom URL
      </CoralField>
    </div>
    {
      type === LIB_TYPES.REMOTE ?
        <div className="FieldSubset">
          <div className="u-gapBottom">
            <label>
              <span className="Label">HTTP URL:</span>
              <div>
                <CoralField
                  name="libraryCode.httpUrl"
                  component={ Textfield }
                  componentClassName="Field--long"
                  placeholder="http://"
                  supportValidation
                />
              </div>
            </label>
            <label>
              <span className="Label u-gapTop">HTTPS URL:</span>
              <div>
                <CoralField
                  name="libraryCode.httpsUrl"
                  component={ Textfield }
                  componentClassName="Field--long"
                  placeholder="https://"
                  supportValidation
                />
              </div>
            </label>
          </div>
          <OverwriteReportSuites className="u-block u-gapBottom" />
          <TrackerVariableName className="u-block u-gapBottom" />
          <LoadPhase />
        </div> : null
    }

    <div>
      <CoralField
        name="libraryCode.type"
        component={ Radio }
        value={ LIB_TYPES.CUSTOM }
      >
        Let me provide custom library code
      </CoralField>
    </div>
    {
      type === LIB_TYPES.CUSTOM ?
        <div className="FieldSubset">
          <div className="u-gapBottom">
            <CodeField name="libraryCode.source" />
          </div>
          <OverwriteReportSuites className="u-block u-gapBottom" />
          <TrackerVariableName className="u-block u-gapBottom" />
          <LoadPhase />
        </div> : null
    }
  </div>
);

export default connect(
  state => ({
    type: formValueSelector('default')(state, 'libraryCode.type')
  })
)(LibraryManagement);

const forceProtocolPrefix = (str, prefix) =>
  (!str || str.indexOf(prefix) === 0 ? str : prefix + str);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      accounts,
      type,
      trackerVariableName,
      loadPhase,
      httpUrl,
      httpsUrl,
      source
    } = settings.libraryCode || {};

    const showReportSuites = Boolean(type !== LIB_TYPES.MANAGED && accounts);

    return {
      ...values,
      libraryCode: {
        type: type || LIB_TYPES.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        loadPhase: loadPhase || LOAD_PHASES.PAGE_BOTTOM,
        accounts,
        showReportSuites,
        httpUrl,
        httpsUrl,
        source
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      type,
      trackerVariableName,
      loadPhase,
      httpUrl,
      httpsUrl,
      source,
      showReportSuites
    } = values.libraryCode || {};

    const libraryCodeSettings = {
      type
    };

    const exportReportSuites =
      (type !== LIB_TYPES.MANAGED && showReportSuites) || type === LIB_TYPES.MANAGED;
    if (exportReportSuites && values.libraryCode.accounts) {
      const accounts = {};

      for (const environment of ENVIRONMENTS) {
        const accountsForEnvironment = values.libraryCode.accounts[environment];
        if (accountsForEnvironment && accountsForEnvironment.length > 0) {
          accounts[environment] = accountsForEnvironment;
        }
      }

      if (Object.keys(accounts).length) {
        libraryCodeSettings.accounts = accounts;
      }
    }

    if (type !== LIB_TYPES.PREINSTALLED) {
      libraryCodeSettings.loadPhase = loadPhase;
    }

    if (type !== LIB_TYPES.MANAGED) {
      libraryCodeSettings.trackerVariableName = trackerVariableName;
    }

    if (type === LIB_TYPES.REMOTE) {
      libraryCodeSettings.httpUrl = forceProtocolPrefix(httpUrl || '', 'http://');
      libraryCodeSettings.httpsUrl = forceProtocolPrefix(httpsUrl || '', 'https://');
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

    const libraryCodeErrors = {};

    const reportSuitesAreRequired =
      (type !== LIB_TYPES.MANAGED && showReportSuites) || type === LIB_TYPES.MANAGED;
    const productionAccountsAreMissing = !accounts.production || accounts.production.length === 0;
    if (reportSuitesAreRequired && productionAccountsAreMissing) {
      libraryCodeErrors.accounts = {
        production: 'Please specify a report suite'
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

    return {
      ...errors,
      libraryCode: libraryCodeErrors
    };
  }
};
