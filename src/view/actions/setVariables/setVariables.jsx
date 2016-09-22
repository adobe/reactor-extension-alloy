import React from 'react';
import { mergeConfigs } from '../../utils/formConfigUtils';
import Variables, { formConfig as variablesFormConfig } from '../../components/variables';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from '../components/configurationSelector';
import CustomSetup, { formConfig as customSetupConfig } from '../../components/customSetup';

export default ({ ...props }) => (
  <div>
    <ConfigurationSelector className="u-gapBottom" />
    <h4 className="coral-Heading coral-Heading--4">Variables</h4>
    <Variables showDynamicVariablePrefix={ false } />
    <h4 className="u-gapTop2x coral-Heading coral-Heading--4">Custom Page Code</h4>
    <CustomSetup showLoadPhase={ false } />
  </div>
);

export const formConfig = mergeConfigs(
  configurationSelectorFormConfig,
  variablesFormConfig,
  customSetupConfig);

