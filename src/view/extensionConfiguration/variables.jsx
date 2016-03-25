import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { DataElementField } from '@reactor/react-components';
import EVars, { formConfig as eVarFormConfig } from './eVars';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

export default class Variables extends React.Component {
  render() {
    const {
      server,
      dynamicVariablePrefix
    } = this.props.fields;

    return (
      <div>
        <label>
          Server
          <Coral.Textfield {...server}/>
        </label>
        <EVars fields={this.props.fields}/>
        <label>
          Dynamic Variable Prefix
          <Coral.Textfield {...dynamicVariablePrefix}/>
        </label>
      </div>
    );
  }
}

export const formConfig = createFormConfig(
  eVarFormConfig,
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
        ...settings,
        server
      };

      if (dynamicVariablePrefix !== DYNAMIC_VARIABLE_PREFIX_DEFAULT) {
        settings.dynamicVariablePrefix = dynamicVariablePrefix;
      }

      return settings;
    }
  }
);
