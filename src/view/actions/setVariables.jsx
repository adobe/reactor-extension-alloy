import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from './components/configurationSelector';
import CustomSetup, { formConfig as customSetupConfig } from '../components/customSetup';

export function SetVariables({ ...props }) {
  return (
    <div>
      <ConfigurationSelector className="u-gapBottom" fields={ props.fields } />
      <h4 className="coral-Heading coral-Heading--4">Variables</h4>
      <Variables fields={ props.fields } showDynamicVariablePrefix={ false } />
      <h4 className="u-gapTop2x coral-Heading coral-Heading--4">Custom Page Code</h4>
      <CustomSetup fields={ props.fields } showLoadPhase={ false } />
    </div>
  );
}

const formConfig = mergeFormConfigs(
  configurationSelectorFormConfig,
  variablesFormConfig,
  customSetupConfig);

export default extensionViewReduxForm(formConfig)(SetVariables);

