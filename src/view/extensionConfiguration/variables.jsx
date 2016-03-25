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
        <section>
          <h4 className="coral-Heading coral-Heading--4">Tracking Server</h4>
          <label>
            <span className="u-label">Server</span>
            <Coral.Textfield {...server}/>
          </label>
        </section>

        <EVars fields={this.props.fields}/>

        <section>
          <h4 className="coral-Heading coral-Heading--4">Dynamic Variable Prefix</h4>
          <label>
            <span className="u-label">Prefix</span>
            <Coral.Textfield {...dynamicVariablePrefix}/>
          </label>
        </section>
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
