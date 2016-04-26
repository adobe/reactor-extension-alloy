import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, ErrorTip } from '@reactor/react-components';

import ReportSuite from './components/reportSuite';
import createFormConfig from '../utils/createFormConfig';

const libTypes = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

const loadPhases = {
  PAGE_TOP: 'pageTop',
  PAGE_BOTTOM: 'pageBottom'
};

const environments = [
  'production',
  'staging',
  'development'
];

const ReportSuites = props => {
  return (
    <section className="ReportSuites-container">
      <h4 className="coral-Heading coral-Heading--4">
        Report Suites
        <Coral.Icon id="ReportSuiteTooltip" icon="infoCircle" size="XS" className="u-gapLeft"/>
      </h4>
      <Coral.Tooltip placement="right" target="#ReportSuiteTooltip">
        Some tooltip
      </Coral.Tooltip>

      <section className="ReportSuites-fieldsContainer">
        <ReportSuite
          label="Production Report Suite(s)"
          {...props.production}/>
        <ReportSuite
          label="Staging Report Suite(s)"
          {...props.staging}/>
        <ReportSuite
          label="Development Report Suite(s)"
          {...props.development}/>
      </section>
    </section>
  );
};

const LoadPhase = props => {
  const { loadPhase } = props.fields.libraryCode;

  return (
    <div className={props.className}>
      <span className="u-label">Load library at:</span>
      <Coral.Radio
        {...loadPhase}
        value={loadPhases.PAGE_TOP}
        checked={loadPhase.value === loadPhases.PAGE_TOP}>Page Top</Coral.Radio>
      <Coral.Radio
        {...loadPhase}
        value={loadPhases.PAGE_BOTTOM}
        checked={loadPhase.value === loadPhases.PAGE_BOTTOM}>Page Bottom</Coral.Radio>
    </div>
  );
};

const TrackerVariableName = props => {
  const { trackerVariableName } = props.fields.libraryCode;

  return (
    <ValidationWrapper
      className={props.className}
      error={trackerVariableName.touched && trackerVariableName.error}>
      <label>
        <span className="u-label">Tracker is accessible on the global variable named:</span>
        <Coral.Textfield {...trackerVariableName}/>
      </label>
    </ValidationWrapper>
  );
};

const OverwriteReportSuites = props => {
  const { libraryCode } = props.fields;

  return (
    <div>
      <Coral.Checkbox
        {...libraryCode.showReportSuites}>
        Set the following report suites on tracker
      </Coral.Checkbox>
      {
        libraryCode.showReportSuites.value ?
          <ReportSuites {...libraryCode.accounts}/> : null
      }
    </div>
  );
};

export default class LibraryManagement extends React.Component {
  onOpenEditor = () => {
    let scriptField = this.props.fields.libraryCode.script;
    window.extensionBridge.openCodeEditor(scriptField.value, scriptField.onChange);
  };


  render() {
    const {
      type,
      httpUrl,
      httpsUrl,
      script
    } = this.props.fields.libraryCode;

    return (
      <div>
        <Coral.Radio
          {...type}
          value={libTypes.MANAGED}
          checked={type.value === libTypes.MANAGED}>
          Manage the library for me
        </Coral.Radio>
        {
          type.value === libTypes.MANAGED ?
            <div className="LibraryManagement-optionSubset">
              <ReportSuites {...this.props.fields.libraryCode.accounts}/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }

        <div>
          <Coral.Radio
            {...type}
            value={libTypes.PREINSTALLED}
            checked={type.value === libTypes.PREINSTALLED}>
            Use the library already installed on the page
          </Coral.Radio>
        </div>
        {
          type.value === libTypes.PREINSTALLED ?
            <div className="LibraryManagement-optionSubset">
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName fields={this.props.fields}/>
            </div> : null
        }

        <div>
          <Coral.Radio
            {...type}
            value={libTypes.REMOTE}
            checked={type.value === libTypes.REMOTE}>
            Load the library from a custom URL
          </Coral.Radio>
        </div>
        {
          type.value === libTypes.REMOTE ?
            <div className="LibraryManagement-optionSubset">
              <div className="u-gapBottom">
                <ValidationWrapper
                  error={httpUrl.touched && httpUrl.error}
                  className="u-gapRight">
                  <label>
                    <span className="u-label">HTTP URL:</span>
                    <Coral.Textfield {...httpUrl} placeholder="http://"/>
                  </label>
                </ValidationWrapper>
                <ValidationWrapper
                  error={httpsUrl.touched && httpsUrl.error}>
                  <label>
                    <span className="u-label">HTTPS URL:</span>
                    <Coral.Textfield {...httpsUrl} placeholder="https://"/>
                  </label>
                 </ValidationWrapper>
              </div>
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }

        <div>
          <Coral.Radio
            {...type}
            value={libTypes.CUSTOM}
            checked={type.value === libTypes.CUSTOM}>
            Let me provide custom library code
          </Coral.Radio>
        </div>
        {
          type.value === libTypes.CUSTOM ?
            <div className="LibraryManagement-optionSubset">
              <div className="u-gapBottom">
                <Coral.Button ref="openEditorButton" icon="code" onClick={this.onOpenEditor}>
                  Open Editor
                </Coral.Button>
                {
                  script.touched && script.error ?
                    <ErrorTip ref="scriptErrorIcon" message={script.error}/> : null
                }
              </div>
              <OverwriteReportSuites
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }
      </div>
    );
  }
}

const forcePrefix = (str, prefix) => {
  return !str || str.indexOf(prefix) === 0 ? str : prefix + str;
};

export const formConfig = createFormConfig({
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
    'libraryCode.script'
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
      script
    } = options.settings.libraryCode || {};

    const showReportSuites = Boolean(type !== libTypes.MANAGED && accounts);

    return {
      ...values,
      libraryCode: {
        type: type || libTypes.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        loadPhase: loadPhase || loadPhases.PAGE_BOTTOM,
        reportSuitesPreconfigured,
        accounts,
        showReportSuites,
        httpUrl,
        httpsUrl,
        script
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
      script
    } = values.libraryCode || {};

    const libraryCodeSettings = {
      type
    };

    if (values.libraryCode.accounts) {
      const accounts = {};

      for (let environment of environments) {
        const accountsForEnvironment = values.libraryCode.accounts[environment];
        if (accountsForEnvironment && accountsForEnvironment.length > 0) {
          accounts[environment] = accountsForEnvironment;
        }
      }

      if (Object.keys(accounts).length) {
        libraryCodeSettings.accounts = accounts;
      }
    }

    if (type !== libTypes.PREINSTALLED) {
      libraryCodeSettings.loadPhase = loadPhase;
    }

    if (type !== libTypes.MANAGED) {
      libraryCodeSettings.trackerVariableName = trackerVariableName;
    }

    if (type === libTypes.REMOTE) {
      libraryCodeSettings.httpUrl = forcePrefix(httpUrl || '', 'http://');
      libraryCodeSettings.httpsUrl = forcePrefix(httpsUrl || '', 'https://');
      libraryCodeSettings.reportSuitesPreconfigured = reportSuitesPreconfigured;
    }

    if (type === libTypes.CUSTOM) {
      libraryCodeSettings.script = script;
      libraryCodeSettings.reportSuitesPreconfigured = reportSuitesPreconfigured;
    }

    return {
      ...settings,
      libraryCode: libraryCodeSettings
    };
  },
  validate(errors, values) {
    const {
      accounts,
      showReportSuites,
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      script
    } = values.libraryCode;

    const libraryCodeErrors = {};

    const reportSuitesAreRequired =
      (type !== libTypes.MANAGED && showReportSuites) || type === libTypes.MANAGED;
    const productionAccountsAreMissing = !accounts.production || accounts.production.length === 0;
    if (reportSuitesAreRequired && productionAccountsAreMissing) {
      libraryCodeErrors.accounts = {
        production: 'Please specify a report suite'
      };
    }

    if (type !== libTypes.MANAGED && !trackerVariableName) {
      libraryCodeErrors.trackerVariableName = 'Please specify a variable name';
    }

    if (type === libTypes.REMOTE) {
      if (!httpUrl) {
        libraryCodeErrors.httpUrl = 'Please specify an HTTP URL';
      }

      if (!httpsUrl) {
        libraryCodeErrors.httpsUrl = 'Please specify an HTTPS URL';
      }
    }

    if (type === libTypes.CUSTOM && !script) {
      libraryCodeErrors.script = 'Please provide custom code';
    }

    return {
      ...errors,
      libraryCode: libraryCodeErrors
    };
  }
});
