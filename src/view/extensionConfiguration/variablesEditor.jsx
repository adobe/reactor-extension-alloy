import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { ValidationWrapper } from '@reactor/react-components';
import { DataElementSelectorButton } from '@reactor/react-components';
import classNames from 'classnames';
import createId from '../utils/createId';

// TODO: Replace with actual values from user's product level.
const maxItems = {
  eVar: 250,
  prop: 75
};

export default class VariablesEditor extends React.Component {
  createOptions = varType => {
    const options = [];
    const numItems = maxItems[varType];

    for (let i = 0; i < numItems; i++) {
      const value = varType + (i + 1);
      options.push(<Coral.Select.Item key={value} value={value}>{value}</Coral.Select.Item>);
    }

    return options;
  };

  createEmptyRow = () => {
    this.props.fields.trackerProperties[this.props.varTypePlural].addField({
      id: createId(),
      type: 'value'
    });
  };

  removeVariable = index => {
    this.props.fields.trackerProperties[this.props.varTypePlural].removeField(index);
  };

  openDataElementSelector = field => {
    window.extensionBridge.openDataElementSelector(field.value.onChange);
  };

  render() {
    const variables = this.props.fields.trackerProperties[this.props.varTypePlural];

    const rows = variables.map((variable, index) => {
      const nameOptions = this.createOptions(this.props.varType);
      const valueOptions = this.createOptions('eVar').concat(this.createOptions('prop'));
      const namePlaceholder = 'Select ' + this.props.varType;

      return (
        <div
          key={variable.id.value}
          className="u-gapBottom2x">
          <ValidationWrapper
            error={variable.name.touched && variable.name.error}
            className="u-gapRight2x">
            <Coral.Select
              className="VariablesEditor-smallField"
              placeholder={namePlaceholder}
              {...variable.name}>
              {nameOptions}
            </Coral.Select>
          </ValidationWrapper>
          <Coral.Select
            className="VariablesEditor-smallField u-gapRight2x"
            {...variable.type}>
            <Coral.Select.Item
              value="value">
              Set as
            </Coral.Select.Item>
            <Coral.Select.Item
              value="alias">
              Duplicate from
            </Coral.Select.Item>
          </Coral.Select>
          <ValidationWrapper error={variable.value.touched && variable.value.error}>
            {
              variable.type.value === 'value' ?
                <Coral.Textfield
                  className="VariablesEditor-smallField"
                  {...variable.value}/> :
                <Coral.Select
                  className="VariablesEditor-smallField"
                  placeholder="Select variable"
                  {...variable.value}>
                  {valueOptions}
                </Coral.Select>
            }
            <DataElementSelectorButton
              className={classNames({'u-hidden': variable.type.value !== 'value'})}
              onClick={this.openDataElementSelector.bind(this, variable)}/>
          </ValidationWrapper>
          {
            index !== variables.length - 1 ?
              <Coral.Button
                ref="removeButton"
                variant="quiet"
                icon="close"
                iconSize="XS"
                onClick={this.removeVariable.bind(this, index)}/> : null
          }
        </div>
      );
    });

    return (
      <section>
        {rows}
        <Coral.Button onClick={this.createEmptyRow}>Add {this.props.varType}</Coral.Button>
      </section>
    );
  }
}

export const getFormConfig = (varType, varTypePlural) => {
  return createFormConfig({
    fields: [
      `trackerProperties.${varTypePlural}[].id`,
      `trackerProperties.${varTypePlural}[].name`,
      `trackerProperties.${varTypePlural}[].type`,
      `trackerProperties.${varTypePlural}[].value`
    ],
    settingsToFormValues(values, options) {
      values = {
        ...values
      };

      let variables;

      if (options.settings.trackerProperties) {
        variables = options.settings.trackerProperties[varTypePlural];
      }

      variables = variables ? variables.slice() : [];

      // Add an extra object which will ensures that there is an empty row available for the user
      // to configure their next variable.
      variables.push({});

      variables.forEach(variable => {
        variable.id = createId();
        variable.type = variable.type || 'value'
      });

      values.trackerProperties = values.trackerProperties || {};
      values.trackerProperties[varTypePlural] = variables;

      return values;
    },
    formValuesToSettings(settings, values) {
      settings = {
        ...settings
      };

      const variables = values.trackerProperties[varTypePlural].filter(variable => {
        return variable.name;
      }).map(variable => {
        // Everything but id.
        return {
          name: variable.name,
          type: variable.type,
          value: variable.value
        };
      });

      if (variables.length) {
        settings.trackerProperties = settings.trackerProperties || {};
        settings.trackerProperties[varTypePlural] = variables;
      }

      return settings;
    },
    validate(errors, values) {
      errors = {
        ...errors
      };

      const variables = values.trackerProperties[varTypePlural];
      const configuredVariableNames = [];

      errors.trackerProperties = errors.trackerProperties || {};
      errors.trackerProperties[varTypePlural] = variables.map(variable => {
        const variableErrors = {};

        if (variable.name) {
          if (configuredVariableNames.indexOf(variable.name) === -1) {
            configuredVariableNames.push(variable.name);
          } else {
            variableErrors.name = 'This ' + varType + ' is already configured';
          }
        } else if (variable.value) {
          variableErrors.name = 'Please provide a name';
        }

        if (!variable.value && variable.name) {
          variableErrors.value = 'Please provide a value';
        }

        return variableErrors;
      });

      return errors;
    }
  });
};

