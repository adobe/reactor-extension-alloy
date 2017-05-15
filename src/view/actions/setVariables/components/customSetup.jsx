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
import { Field } from 'redux-form';
import EditorButton from '@reactor/react-components/lib/reduxForm/editorButton';

export default () => (
  <div>
    <p>
      Use the editor below to set additional variables on the tracker using custom code. The
      following variables are available for use within your custom code:
    </p>

    <ul>
      <li><i>s</i> - The tracker object.</li>
      <li><i>event</i> - The underlying event object that caused this rule to fire.</li>
    </ul>

    <Field
      name="customSetup.source"
      component={ EditorButton }
    />
  </div>
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      source
    } = settings.customSetup || {};

    return {
      ...values,
      customSetup: {
        source
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      source
    } = values.customSetup;

    if (source) {
      settings = {
        ...settings,
        customSetup: {
          source
        }
      };
    }

    return settings;
  }
};

