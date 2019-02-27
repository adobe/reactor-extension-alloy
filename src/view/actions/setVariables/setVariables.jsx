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
import Heading from '@react/react-spectrum/Heading';
import Alert from '@react/react-spectrum/Alert';
import { mergeConfigs } from '../../utils/formConfigUtils';
import Variables, { formConfig as variablesFormConfig } from '../../components/variables';
import CustomSetup, { formConfig as customSetupConfig } from './components/customSetup';

export default () => (
  <div>
    <Heading size="4">Variables</Heading>
    <Alert variant="info">
      Please note, this action will <span className="u-italic">not</span> send a
      beacon; it only sets the variables. In order to send the data to Adobe Analytics, you need
      to add the &quot;send beacon&quot; action from the Adobe Analytics extension to a rule.
    </Alert>
    <Variables showDynamicVariablePrefix={ false } />
    <Heading size="4">Custom Code</Heading>
    <CustomSetup />
  </div>
);

export const formConfig = mergeConfigs(
  variablesFormConfig,
  customSetupConfig
);
