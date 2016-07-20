import React from 'react';
import { DataElementSelectorButton } from '@reactor/react-components';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import openDataElementSelector from '../../utils/openDataElementSelector';
import CHAR_SET_PRESETS from '../../enums/charSets';

const CHAR_SET_INPUT_METHOD = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CHAR_SET_DEFAULT = 'ASCII';

export default class CharSet extends React.Component {
  onTypeChange = value => {
    const {
      charSetInputMethod,
      charSet
    } = this.props.fields.trackerProperties;

    charSet.onChange(value === CHAR_SET_INPUT_METHOD.PRESET ? CHAR_SET_DEFAULT : '');
    charSetInputMethod.onChange(value);
  };

  render() {
    const {
      charSetInputMethod,
      charSet
    } = this.props.fields.trackerProperties;

    const presetOptions = CHAR_SET_PRESETS.map(preset => ({
      label: preset,
      value: preset
    }));

    return (
      <div>
        <div>
          <Radio
            { ...charSetInputMethod }
            onChange={ this.onTypeChange }
            value={ CHAR_SET_INPUT_METHOD.PRESET }
            checked={ charSetInputMethod.value === CHAR_SET_INPUT_METHOD.PRESET }
          >
            Preset
          </Radio>
          {
            charSetInputMethod.value === CHAR_SET_INPUT_METHOD.PRESET ?
              <div className="FieldSubset">
                <Select { ...charSet } options={ presetOptions } />
              </div> : null
          }
        </div>
        <div>
          <Radio
            { ...charSetInputMethod }
            onChange={ this.onTypeChange }
            value={ CHAR_SET_INPUT_METHOD.CUSTOM }
            checked={ charSetInputMethod.value === CHAR_SET_INPUT_METHOD.CUSTOM }
          >
            Custom
          </Radio>
          {
            charSetInputMethod.value === CHAR_SET_INPUT_METHOD.CUSTOM ?
              <div className="FieldSubset">
                <Textfield { ...charSet } />
                <DataElementSelectorButton
                  onClick={ openDataElementSelector.bind(this, charSet) }
                />
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'trackerProperties.charSetInputMethod',
    'trackerProperties.charSet'
  ],
  settingsToFormValues(values, options) {
    const {
      charSet
    } = options.settings.trackerProperties || {};

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
