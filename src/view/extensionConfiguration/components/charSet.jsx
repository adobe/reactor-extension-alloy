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
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

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
        type="radio"
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
        type="radio"
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
