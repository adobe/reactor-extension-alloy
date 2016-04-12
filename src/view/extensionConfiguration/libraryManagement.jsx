import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { ValidationWrapper, ErrorTip } from '@reactor/react-components';

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

const SkipSetAccount = props => {
  const { reportSuitesPreconfigured } = props.fields.libraryCode;

  return (
    <Coral.Checkbox
      {...reportSuitesPreconfigured}
      className={props.className}>
      Use report suites that have been set within the code
    </Coral.Checkbox>
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
          checked={type.value === libTypes.MANAGED}
          className="u-block">
          Manage the library for me
        </Coral.Radio>
        {
          type.value === libTypes.MANAGED ?
            <div className="LibraryManagement-optionSubset">
              <LoadPhase fields={this.props.fields}/>
            </div>: null
        }

        <Coral.Radio
          {...type}
          value={libTypes.PREINSTALLED}
          checked={type.value === libTypes.PREINSTALLED}
          className="u-block">
          Use the library already installed on the page
        </Coral.Radio>
        {
          type.value === libTypes.PREINSTALLED ?
            <div className="LibraryManagement-optionSubset">
              <TrackerVariableName fields={this.props.fields}/>
            </div> : null
        }

        <Coral.Radio
          {...type}
          value={libTypes.REMOTE}
          checked={type.value === libTypes.REMOTE}
          className="u-block">
          Load the library from a custom URL
        </Coral.Radio>
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
              <SkipSetAccount
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }

        <Coral.Radio
          {...type}
          value={libTypes.CUSTOM}
          checked={type.value === libTypes.CUSTOM}
          className="u-block">
          Let me provide custom library code
        </Coral.Radio>
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
              <SkipSetAccount
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
  return str.indexOf(prefix) === 0 ? str : prefix + str;
};

export const formConfig = createFormConfig({
  fields: [
    'libraryCode.type',
    'libraryCode.trackerVariableName',
    'libraryCode.loadPhase',
    'libraryCode.reportSuitesPreconfigured',
    'libraryCode.httpUrl',
    'libraryCode.httpsUrl',
    'libraryCode.script'
  ],
  settingsToFormValues(values, options) {
    const {
      type,
      trackerVariableName,
      loadPhase,
      reportSuitesPreconfigured,
      httpUrl,
      httpsUrl,
      script
    } = options.settings.libraryCode || {};

    return {
      ...values,
      libraryCode: {
        type: type || libTypes.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        loadPhase: loadPhase || loadPhases.PAGE_BOTTOM,
        reportSuitesPreconfigured,
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
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      script
    } = values.libraryCode;

    const libraryCodeErrors = {};

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
