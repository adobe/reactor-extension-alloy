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
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from './wrappedField';
import EditorButton from './editorButton';

const LOAD_PHASES = {
  BEFORE_SETTINGS: 'beforeSettings',
  AFTER_SETTINGS: 'afterSettings'
};

const LOAD_PHASE_DEFAULT = LOAD_PHASES.AFTER_SETTINGS;

const CustomSetup = ({ source }) => (
  <div>
    <p>
      Use the editor below to provide code to further configure the tracker. The following
      variables are available for use within your custom code:
    </p>

    <ul>
      <li><i>s</i> - The tracker object.</li>
    </ul>

    <WrappedField
      name="source"
      component={ EditorButton }
    />

    { source ?
      <div>
        <fieldset>
          <legend><span className="Label u-gapTop">Execute custom code</span></legend>
          <div>
            <WrappedField
              name="customSetup.loadPhase"
              component={ Radio }
              type="radio"
              value={ LOAD_PHASES.BEFORE_SETTINGS }
            >
              Before other settings are applied
            </WrappedField>

            <WrappedField
              name="customSetup.loadPhase"
              component={ Radio }
              type="radio"
              value={ LOAD_PHASES.AFTER_SETTINGS }
            >
              After other settings are applied
            </WrappedField>
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

