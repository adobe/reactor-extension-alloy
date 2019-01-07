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
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';
import { change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from './wrappedField';
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
      <WrappedField
        name="trackerProperties.charSetInputMethod"
        component={ RadioGroup }
        vertical
      >
        <Radio
          value={ CHAR_SET_INPUT_METHOD.PRESET }
          label="Preset"
          onChange={
            () => dispatch(change('default', 'trackerProperties.charSet', CHAR_SET_DEFAULT))
          }
        />
      </WrappedField>
      {
        charSetInputMethod === CHAR_SET_INPUT_METHOD.PRESET ?
          <div className="FieldSubset">
            <WrappedField
              name="trackerProperties.charSet"
              component={ Select }
              onBlur={ e => e.preventDefault() }
              options={ presetOptions }
            />
          </div> : null
      }
    </div>
    <div>
      <WrappedField
        name="trackerProperties.charSetInputMethod"
        component={ RadioGroup }
        vertical
      >
        <Radio
          value={ CHAR_SET_INPUT_METHOD.CUSTOM }
          label="Custom"
          onChange={
            () => dispatch(change('default', 'trackerProperties.charSet', ''))
          }
        />
      </WrappedField>
      {
        charSetInputMethod === CHAR_SET_INPUT_METHOD.CUSTOM ?
          <div className="FieldSubset">
            <WrappedField
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
