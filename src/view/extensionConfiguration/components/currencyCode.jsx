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
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Autocomplete from '@coralui/redux-form-react-coral/lib/Autocomplete';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import { connect } from 'react-redux';
import { Field, change, formValueSelector } from 'redux-form';

import CURRENCY_CODE_PRESETS from '../../enums/currencyCodes';

const CURRENCY_CODE_INPUT_METHODS = {
  PRESET: 'preset',
  CUSTOM: 'custom'
};

const CURRENCY_CODE_DEFAULT = 'USD';

const presetOptions = CURRENCY_CODE_PRESETS.map(preset => ({
  label: `${preset.value} - ${preset.label}`,
  value: preset.value
}));

const CurrencyCode = ({ dispatch, currencyCodeInputMethod }) => (
  <div>
    <div>
      <Field
        name="trackerProperties.currencyCodeInputMethod"
        component={ Radio }
        type="radio"
        value={ CURRENCY_CODE_INPUT_METHODS.PRESET }
        onChange={
          () => dispatch(change('default', 'trackerProperties.currencyCode', CURRENCY_CODE_DEFAULT))
        }
      >
        Preset
      </Field>

      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.PRESET ?
          <div className="FieldSubset">
            <Field
              name="trackerProperties.currencyCode"
              component={ Autocomplete }
              inputClassName="Field--long"
              options={ presetOptions }
            />
          </div> : null
      }
    </div>
    <div>
      <Field
        name="trackerProperties.currencyCodeInputMethod"
        component={ Radio }
        type="radio"
        value={ CURRENCY_CODE_INPUT_METHODS.CUSTOM }
        onChange={
          () => dispatch(change('default', 'trackerProperties.currencyCode', ''))
        }
      >
        Custom
      </Field>

      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.CUSTOM ?
          <div className="FieldSubset">
            <Field
              name="trackerProperties.currencyCode"
              component={ DecoratedInput }
              inputComponent={ Textfield }
              supportDataElement
            />
          </div> : null
      }
    </div>
  </div>
);

export default connect(
  state => ({
    currencyCodeInputMethod:
      formValueSelector('default')(state, 'trackerProperties.currencyCodeInputMethod')
  })
)(CurrencyCode);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      currencyCode
    } = settings.trackerProperties || {};

    const currencyCodeInputMethod =
      !currencyCode || CURRENCY_CODE_PRESETS.map(currency => currency.value)
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
