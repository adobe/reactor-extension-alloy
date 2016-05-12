import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from './components/configurationSelector';

class SetVariables extends React.Component {
  render() {
    return (
      <div>
        <ConfigurationSelector fields={this.props.fields}/>
        <Variables fields={this.props.fields}/>
      </div>
    );
  }
}

const formConfig = mergeFormConfigs(
  configurationSelectorFormConfig,
  variablesFormConfig);

export default extensionViewReduxForm(formConfig)(SetVariables);

