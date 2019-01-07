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
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Textfield from '@react/react-spectrum/Textfield';
import Select from '@react/react-spectrum/Select';
import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import WrappedField from './wrappedField';
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
      <WrappedField
        name="trackerProperties.currencyCodeInputMethod"
        component={ RadioGroup }
        vertical
      >
        <Radio
          value={ CURRENCY_CODE_INPUT_METHODS.PRESET }
          label="Preset"
          onChange={
            () => dispatch(change('default', 'trackerProperties.currencyCode', CURRENCY_CODE_DEFAULT))
          }
        />
      </WrappedField>
      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.PRESET ?
          <div className="FieldSubset">
            <WrappedField
              name="trackerProperties.currencyCode"
              component={ Select }
              componentClassName="Field--long"
              onBlur={ e => e.preventDefault() }
              options={ presetOptions }
            />
          </div> : null
      }
    </div>
    <div>
      <WrappedField
        name="trackerProperties.currencyCodeInputMethod"
        component={ RadioGroup }
        vertical
      >
        <Radio
          value={ CURRENCY_CODE_INPUT_METHODS.CUSTOM }
          label="Custom"
          onChange={
            () => dispatch(change('default', 'trackerProperties.currencyCode', ''))
          }
        />
      </WrappedField>
      {
        currencyCodeInputMethod === CURRENCY_CODE_INPUT_METHODS.CUSTOM ?
          <div className="FieldSubset">
            <WrappedField
              name="trackerProperties.currencyCode"
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

    if (currencyCode) {
      trackerProperties.currencyCode = currencyCode;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};
