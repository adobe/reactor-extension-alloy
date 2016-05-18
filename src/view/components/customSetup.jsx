import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';

var LOAD_PHASES = {
  BEFORE_SETTINGS: 'beforeSettings',
  AFTER_SETTINGS: 'afterSettings'
};

const LOAD_PHASE_DEFAULT = LOAD_PHASES.AFTER_SETTINGS;

export default class CustomSetup extends React.Component {
  onOpenEditor = field => {
    window.extensionBridge.openCodeEditor(field.value, field.onChange);
  };

  render() {
    const {
      script,
      loadPhase
    } = this.props.fields.customSetup;

    const {
      showLoadPhase = true,
    } = this.props;

    return (
      <div>
        <Coral.Button
          className="u-gapTop"
          icon="code"
          onClick={this.onOpenEditor.bind(this, script)}>
          Open Editor
        </Coral.Button>
        { showLoadPhase ?
            <div>
              <fieldset>
                <legend><span className="Label u-gapTop">Execute custom code</span></legend>
                <div>
                  <Coral.Radio
                    {...loadPhase}
                    value={LOAD_PHASES.BEFORE_SETTINGS}
                    checked={loadPhase.value === LOAD_PHASES.BEFORE_SETTINGS}>
                    Before other settings are applied
                  </Coral.Radio>
                  <Coral.Radio
                    {...loadPhase}
                    value={LOAD_PHASES.AFTER_SETTINGS}
                    checked={loadPhase.value === LOAD_PHASES.AFTER_SETTINGS}>
                    After other settings are applied
                  </Coral.Radio>
                </div>
              </fieldset>
            </div> : null
        }
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'customSetup.script',
    'customSetup.loadPhase'
  ],
  settingsToFormValues(values, options) {
    const {
      script,
      loadPhase
    } = options.settings.customSetup || {};

    return {
      ...values,
      customSetup: {
        script: script,
        loadPhase: loadPhase || LOAD_PHASES.AFTER_SETTINGS
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      script,
      loadPhase
    } = values.customSetup;

    const customSetup = {
      ...settings.customSetup
    };

    if (script) {
      customSetup.script = script;
    }

    if (loadPhase && loadPhase !== LOAD_PHASE_DEFAULT) {
      customSetup.loadPhase = loadPhase;
    }

    if (Object.keys(customSetup).length > 0) {
      return {
        ...settings,
        customSetup
      };
    }

    return settings;
  }
};

