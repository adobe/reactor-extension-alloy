import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Field from '../../components/field';
import CHAR_SET_PRESETS from '../../enums/charSets';

const CHAR_SET_INPUT_METHOD = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CHAR_SET_DEFAULT = 'ASCII';

const presetOptions = CHAR_SET_PRESETS.map(preset => ({
  label: preset,
  value: preset
}));

const CharSet = ({ dispatch, charSetInputMethod }) => (
  <div>
    <div>
      <Field
        name="trackerProperties.charSetInputMethod"
        component={ Radio }
        value={ CHAR_SET_INPUT_METHOD.PRESET }
        onChange={
          () => dispatch(change('default', 'trackerProperties.charSet', CHAR_SET_DEFAULT))
        }
      >
        Preset
      </Field>

      {
        charSetInputMethod === CHAR_SET_INPUT_METHOD.PRESET ?
          <div className="FieldSubset">
            <Field
              name="trackerProperties.charSet"
              component={ Select }
              options={ presetOptions }
            />
          </div> : null
      }
    </div>
    <div>
      <Field
        name="trackerProperties.charSetInputMethod"
        component={ Radio }
        value={ CHAR_SET_INPUT_METHOD.CUSTOM }
        onChange={
          () => dispatch(change('default', 'trackerProperties.charSet', ''))
        }
      >
        Custom
      </Field>

      {
        charSetInputMethod === CHAR_SET_INPUT_METHOD.CUSTOM ?
          <div className="FieldSubset">
            <Field
              name="trackerProperties.charSet"
              component={ Textfield }
              supportDataElement
            />
          </div> : null
      }
    </div>
  </div>
);

export default connect(
  state => ({
    charSetInputMethod: formValueSelector('default')(state, 'trackerProperties.charSetInputMethod')
  })
)(CharSet);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      charSet
    } = settings.trackerProperties || {};

    const charSetInputMethod = !charSet || CHAR_SET_PRESETS.indexOf(charSet) !== -1 ?
      CHAR_SET_INPUT_METHOD.PRESET :
      CHAR_SET_INPUT_METHOD.CUSTOM;

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        charSetInputMethod,
        charSet: charSet || CHAR_SET_DEFAULT
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      charSet
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties
    };

    // Not setting charSet on trackerProperties implies ASCII.
    if (charSet && charSet !== CHAR_SET_DEFAULT) {
      trackerProperties.charSet = charSet;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};
