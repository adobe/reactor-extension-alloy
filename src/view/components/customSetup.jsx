import React from 'react';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import EditorButton from '@reactor/react-components/lib/reduxForm/editorButton';

const LOAD_PHASES = {
  BEFORE_SETTINGS: 'beforeSettings',
  AFTER_SETTINGS: 'afterSettings'
};

const LOAD_PHASE_DEFAULT = LOAD_PHASES.AFTER_SETTINGS;

const CustomSetup = ({ showLoadPhase = true, source }) => (
  <div>
    <p>
      Use the editor below to customize the page code. The following variables are available for
      use within your custom code:
    </p>

    <ul>
      <li><i>s</i> - The tracker object.</li>
    </ul>

    <Field
      name="customSetup.source"
      component={ EditorButton }
    />

    { showLoadPhase && source ?
      <div>
        <fieldset>
          <legend><span className="Label u-gapTop">Execute custom code</span></legend>
          <div>
            <Field
              name="customSetup.loadPhase"
              component={ Radio }
              type="radio"
              value={ LOAD_PHASES.BEFORE_SETTINGS }
            >
              Before other settings are applied
            </Field>

            <Field
              name="customSetup.loadPhase"
              component={ Radio }
              type="radio"
              value={ LOAD_PHASES.AFTER_SETTINGS }
            >
              After other settings are applied
            </Field>
          </div>
        </fieldset>
      </div> : null
    }
  </div>
);

export default connect(
  state => ({ source: formValueSelector('default')(state, 'customSetup.source') })
)(CustomSetup);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      source,
      loadPhase
    } = settings.customSetup || {};

    return {
      ...values,
      customSetup: {
        source,
        loadPhase: loadPhase || LOAD_PHASES.AFTER_SETTINGS
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      source,
      loadPhase
    } = values.customSetup;

    if (source) {
      const customSetup = {
        source
      };

      if (loadPhase && loadPhase !== LOAD_PHASE_DEFAULT) {
        customSetup.loadPhase = loadPhase;
      }

      settings = {
        ...settings,
        customSetup
      };
    }

    return settings;
  }
};

