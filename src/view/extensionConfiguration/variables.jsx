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
    } = this.props.fields.trackerProperties;

    return (
      <div>
        <section>
          <h4 className="coral-Heading coral-Heading--4">eVars</h4>
          <VariablesEditor varType="eVar" varTypePlural="eVars" fields={this.props.fields}/>
        </section>

        <section>
          <h4 className="coral-Heading coral-Heading--4 u-gapTop">Props</h4>
          <VariablesEditor varType="prop" varTypePlural="props" fields={this.props.fields}/>
        </section>

        <label>
          <span className="Label u-gapTop">Dynamic Variable Prefix</span>
          <div>
            <Coral.Textfield {...dynamicVariablePrefix}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Server</span>
          <div>
            <Coral.Textfield {...server}/>
          </div>
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
      'trackerProperties.server',
      'trackerProperties.dynamicVariablePrefix'
    ],
    settingsToFormValues: (values, options) => {
      const {
        server,
        dynamicVariablePrefix
      } = options.settings.trackerProperties || {};
      
      return {
        ...values,
        trackerProperties: {
          ...values.trackerProperties,
          server,
          dynamicVariablePrefix: dynamicVariablePrefix || DYNAMIC_VARIABLE_PREFIX_DEFAULT
        }
      };
    },
    formValuesToSettings: (settings, values) => {
      const {
        server,
        dynamicVariablePrefix
      } = values.trackerProperties;

      const trackerProperties = {
        ...settings.trackerProperties
      };

      if (server) {
        trackerProperties.server = server;
      }

      if (dynamicVariablePrefix && dynamicVariablePrefix !== DYNAMIC_VARIABLE_PREFIX_DEFAULT) {
        trackerProperties.dynamicVariablePrefix = dynamicVariablePrefix;
      }

      return {
        ...settings,
        trackerProperties
      };
    }
  }
);
