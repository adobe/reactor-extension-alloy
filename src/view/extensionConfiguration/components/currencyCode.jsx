import React from 'react';
import Select from '@coralui/react-coral/lib/Select';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { DataElementSelectorButton } from '@reactor/react-components';

import openDataElementSelector from '../../utils/openDataElementSelector';
import CURRENCY_CODE_PRESETS from '../../enums/currencyCodes';

const CURRENCY_CODE_INPUT_METHODS = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CURRENCY_CODE_DEFAULT = 'USD';

export default class CurrencyCode extends React.Component {
  onTypeChange = value => {
    const {
      currencyCodeInputMethod,
      currencyCode
    } = this.props.fields.trackerProperties;

    currencyCode.onChange(
      value === CURRENCY_CODE_INPUT_METHODS.PRESET ? CURRENCY_CODE_DEFAULT : ''
    );
    currencyCodeInputMethod.onChange(value);
  };

  render() {
    const {
      currencyCodeInputMethod,
      currencyCode
    } = this.props.fields.trackerProperties;

    const presetOptions = CURRENCY_CODE_PRESETS.map(preset => ({
      label: `${preset.value} - ${preset.label}`,
      value: preset.value
    }));

    return (
      <div>
        <div>
          <Radio
            { ...currencyCodeInputMethod }
            onChange={ this.onTypeChange }
            value={ CURRENCY_CODE_INPUT_METHODS.PRESET }
            checked={ currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHODS.PRESET }
          >
            Preset
          </Radio>
          {
            currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHODS.PRESET ?
              <div className="FieldSubset">
                <Select
                  className="Field--long"
                  { ...currencyCode }
                  options={ presetOptions }
                />
              </div> : null
          }
        </div>
        <div>
          <Radio
            { ...currencyCodeInputMethod }
            onChange={ this.onTypeChange }
            value={ CURRENCY_CODE_INPUT_METHODS.CUSTOM }
            checked={ currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHODS.CUSTOM }
          >
            Custom
          </Radio>
          {
            currencyCodeInputMethod.value === CURRENCY_CODE_INPUT_METHODS.CUSTOM ?
              <div className="FieldSubset">
                <Textfield { ...currencyCode } />
                <DataElementSelectorButton
                  onClick={ openDataElementSelector.bind(this, currencyCode) }
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
    'trackerProperties.currencyCodeInputMethod',
    'trackerProperties.currencyCode'
  ],
  settingsToFormValues(values, options) {
    const {
      currencyCode
    } = options.settings.trackerProperties || {};

    const currencyCodeInputMethod =
      !currencyCode || CURRENCY_CODE_PRESETS.map((currency) => currency.value)
        .indexOf(currencyCode) !== -1 ?
          CURRENCY_CODE_INPUT_METHODS.PRESET :
          CURRENCY_CODE_INPUT_METHODS.CUSTOM;

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        currencyCodeInputMethod,
        currencyCode: currencyCode || CURRENCY_CODE_DEFAULT
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      currencyCode
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties
    };

    // Not setting currencyCode on trackerProperties implies USD.
    if (currencyCode && currencyCode !== CURRENCY_CODE_DEFAULT) {
      trackerProperties.currencyCode = currencyCode;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};
