import React from 'react';
import { ValidationWrapper, ErrorTip, InfoTip } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import ENVIRONMENTS from '../../enums/environments';
import ReportSuite from './reportSuite';

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

const ReportSuites = props => (
  <section className="ReportSuites-container">
    <h4 className="coral-Heading coral-Heading--4">
      Report Suites
      <InfoTip>Some tooltip</InfoTip>
    </h4>

    <section className="ReportSuites-fieldsContainer">
      <ReportSuite
        label="Production Report Suite(s)"
        {...props.production}
      />
      <ReportSuite
        label="Staging Report Suite(s)"
        {...props.staging}
      />
      <ReportSuite
        label="Development Report Suite(s)"
        {...props.development}
      />
    </section>
  </section>
);

const LoadPhase = props => {
  const { loadPhase } = props.fields.libraryCode;

  return (
    <div className={props.className}>
      <fieldset>
        <legend><span className="Label">Load library at:</span></legend>
        <div>
          <Radio
            {...loadPhase}
            value={LOAD_PHASES.PAGE_TOP}
            checked={loadPhase.value === LOAD_PHASES.PAGE_TOP}
          >Page Top</Radio>
          <Radio
            {...loadPhase}
            value={LOAD_PHASES.PAGE_BOTTOM}
            checked={loadPhase.value === LOAD_PHASES.PAGE_BOTTOM}
          >Page Bottom</Radio>
        </div>
      </fieldset>
    </div>
  );
};

const TrackerVariableName = props => {
  const { trackerVariableName } = props.fields.libraryCode;

  return (
    <ValidationWrapper
      className={props.className}
      error={trackerVariableName.touched && trackerVariableName.error}
    >
      <label>
        <span className="Label">Tracker is accessible on the global variable named:</span>
        <Textfield className="u-gapLeft" {...trackerVariableName} />
      </label>
    </ValidationWrapper>
  );
};

const OverwriteReportSuites = props => {
  const { libraryCode } = props.fields;

  return (
    <div className={props.className}>
      <Checkbox
        {...libraryCode.showReportSuites}
      >
        Set the following report suites on tracker
      </Checkbox>
      {
        libraryCode.showReportSuites.value ?
          <ReportSuites {...libraryCode.accounts} /> : null
      }
    </div>
  );
};

export default class LibraryManagement extends React.Component {
  onOpenEditor = () => {
    const sourceField = this.props.fields.libraryCode.source;
    window.extensionBridge.openCodeEditor(sourceField.value, sourceField.onChange);
  };

  render() {
    const {
      type,
      httpUrl,
      httpsUrl,
      source
    } = this.props.fields.libraryCode;

    return (
      <div>
        <Radio
          {...type}
          value={LIB_TYPES.MANAGED}
          checked={type.value === LIB_TYPES.MANAGED}
        >
          Manage the library for me
        </Radio>
        {
          type.value === LIB_TYPES.MANAGED ?
            <div className="FieldSubset">
              <ReportSuites {...this.props.fields.libraryCode.accounts} />
              <LoadPhase fields={this.props.fields} />
            </div> : null
        }

        <div>
          <Radio
            {...type}
            value={LIB_TYPES.PREINSTALLED}
            checked={type.value === LIB_TYPES.PREINSTALLED}
          >
            Use the library already installed on the page
          </Radio>
        </div>
        {
          type.value === LIB_TYPES.PREINSTALLED ?
            <div className="FieldSubset">
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-gapBottom"
              />
              <TrackerVariableName fields={this.props.fields} />
            </div> : null
        }

        <div>
          <Radio
            {...type}
            value={LIB_TYPES.REMOTE}
            checked={type.value === LIB_TYPES.REMOTE}
          >
            Load the library from a custom URL
          </Radio>
        </div>
        {
          type.value === LIB_TYPES.REMOTE ?
            <div className="FieldSubset">
              <div className="u-gapBottom">
                <label>
                  <span className="Label">HTTP URL:</span>
                  <div>
                    <ValidationWrapper
                      type="httpUrl"
                      error={httpUrl.touched && httpUrl.error}
                    >
                      <Textfield
                        {...httpUrl}
                        className="Field--long"
                        placeholder="http://"
                      />
                    </ValidationWrapper>
                  </div>
                </label>
                <label>
                  <span className="Label u-gapTop">HTTPS URL:</span>
                  <div>
                    <ValidationWrapper
                      type="httpsUrl"
                      error={httpsUrl.touched && httpsUrl.error}
                    >
                      <Textfield
                        {...httpsUrl}
                        className="Field--long"
                        placeholder="https://"
                      />
                    </ValidationWrapper>
                  </div>
                </label>
              </div>
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-block u-gapBottom"
              />
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"
              />
              <LoadPhase fields={this.props.fields} />
            </div> : null
        }

        <div>
          <Radio
            {...type}
            value={LIB_TYPES.CUSTOM}
            checked={type.value === LIB_TYPES.CUSTOM}
          >
            Let me provide custom library code
          </Radio>
        </div>
        {
          type.value === LIB_TYPES.CUSTOM ?
            <div className="FieldSubset">
              <div className="u-gapBottom">
                <Button icon="code" onClick={this.onOpenEditor}>
                  Open Editor
                </Button>
                {
                  source.touched && source.error ?
                    <ErrorTip>{source.error}</ErrorTip> : null
                }
              </div>
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-block u-gapBottom"
              />
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"
              />
              <LoadPhase fields={this.props.fields} />
            </div> : null
        }
      </div>
    );
  }
}

const forcePrefix = (str, prefix) => (!str || str.indexOf(prefix) === 0 ? str : prefix + str);

export const formConfig = {
  fields: [
    'libraryCode.type',
    'libraryCode.accounts.production',
    'libraryCode.accounts.staging',
    'libraryCode.accounts.development',
    'libraryCode.showReportSuites',
    'libraryCode.trackerVariableName',
    'libraryCode.loadPhase',
    'libraryCode.reportSuitesPreconfigured',
    'libraryCode.httpUrl',
    'libraryCode.httpsUrl',
    'libraryCode.source'
  ],
  settingsToFormValues(values, options) {
    const {
      accounts,
      type,
      trackerVariableName,
      loadPhase,
      reportSuitesPreconfigured,
      httpUrl,
      httpsUrl,
      source
    } = options.settings.libraryCode || {};

    const showReportSuites = Boolean(type !== LIB_TYPES.MANAGED && accounts);

    return {
      ...values,
      libraryCode: {
        type: type || LIB_TYPES.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        loadPhase: loadPhase || LOAD_PHASES.PAGE_BOTTOM,
        reportSuitesPreconfigured,
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
      reportSuitesPreconfigured,
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
      libraryCodeSettings.httpUrl = forcePrefix(httpUrl || '', 'http://');
      libraryCodeSettings.httpsUrl = forcePrefix(httpsUrl || '', 'https://');
      libraryCodeSettings.reportSuitesPreconfigured = reportSuitesPreconfigured;
    }

    if (type === LIB_TYPES.CUSTOM) {
      libraryCodeSettings.source = source;
      libraryCodeSettings.reportSuitesPreconfigured = reportSuitesPreconfigured;
    }

    return {
      ...settings,
      libraryCode: libraryCodeSettings
    };
  },
  validate(errors, values = { libraryCode: { accounts: {} } }) {
    const {
      accounts,
      showReportSuites,
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source
    } = values.libraryCode;

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
