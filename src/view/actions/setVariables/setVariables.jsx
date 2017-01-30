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
import Heading from '@coralui/react-coral/lib/Heading';
import { mergeConfigs } from '../../utils/formConfigUtils';
import Variables, { formConfig as variablesFormConfig } from '../../components/variables';
import CustomSetup, { formConfig as customSetupConfig } from '../../components/customSetup';

export default () => (
  <div>
    <Heading size="4">Variables</Heading>
    <Variables showDynamicVariablePrefix={ false } />
    <Heading size="4">Custom Page Code</Heading>
    <CustomSetup showLoadPhase={ false } />
  </div>
);

export const formConfig = mergeConfigs(
  variablesFormConfig,
  customSetupConfig
);
