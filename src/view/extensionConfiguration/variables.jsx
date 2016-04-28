import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { DataElementField } from '@reactor/react-components';
import VariablesEditor, { getFormConfig as getVariableEditorFormConfig } from './variablesEditor';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

export default class Variables extends React.Component {
  render() {
    const {
      server,
      dynamicVariablePrefix
    } = this.props.fields;

    return (
      <div>
        <h4 className="coral-Heading coral-Heading--4">eVars</h4>
        <VariablesEditor varType="eVar" varTypePlural="eVars" fields={this.props.fields}/>

        <h4 className="coral-Heading coral-Heading--4">Props</h4>
        <VariablesEditor varType="prop" varTypePlural="props" fields={this.props.fields}/>

        <label>
          <span className="u-label u-gapTop">Dynamic Variable Prefix</span>
          <Coral.Textfield {...dynamicVariablePrefix}/>
        </label>

        <label>
          <span className="u-label u-gapTop">Server</span>
          <Coral.Textfield {...server}/>
        </label>
      </div>
    );
  }
}

export const formConfig = createFormConfig(
  getVariableEditorFormConfig('eVar', 'eVars'),
  getVariableEditorFormConfig('prop', 'props'),
  {
    fields: [
      'server',
      'dynamicVariablePrefix'
    ],
    settingsToFormValues: (values, options) => {
      let {
        server,
        dynamicVariablePrefix
      } = options.settings;

      values = {
        ...values,
        server,
        dynamicVariablePrefix: dynamicVariablePrefix || DYNAMIC_VARIABLE_PREFIX_DEFAULT
      };

      return values;
    },
    formValuesToSettings: (settings, values) => {
      let {
        server,
        dynamicVariablePrefix
      } = values;

      var settings = {
        ...settings
      };

      if (server) {
        settings.server = server;
      }

      if (dynamicVariablePrefix && dynamicVariablePrefix !== DYNAMIC_VARIABLE_PREFIX_DEFAULT) {
        settings.dynamicVariablePrefix = dynamicVariablePrefix;
      }

      return settings;
    }
  }
);
