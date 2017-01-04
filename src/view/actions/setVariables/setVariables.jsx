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
