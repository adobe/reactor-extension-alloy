import React from 'react';
import { mergeConfigs } from '../../utils/formConfigUtils';
import Variables, { formConfig as variablesFormConfig } from '../../components/variables';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from '../components/configurationSelector';
import CustomSetup, { formConfig as customSetupConfig } from '../../components/customSetup';
import Heading from '@coralui/react-coral/lib/Heading';

export default () => (
  <div>
    <ConfigurationSelector
      className="u-gapBottom"
      heading="Apply variables for each of the following extension configurations:"
    />
    <Heading size="4">Variables</Heading>
    <Variables showDynamicVariablePrefix={ false } />
    <Heading size="4">Custom Page Code</Heading>
    <CustomSetup showLoadPhase={ false } />
  </div>
);

export const formConfig = mergeConfigs(
  configurationSelectorFormConfig,
  variablesFormConfig,
  customSetupConfig);

