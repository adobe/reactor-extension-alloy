import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import { DataElementSelectorButton } from '@reactor/react-components';
import classNames from 'classnames';
import createId from '../utils/createId';
import openDataElementSelector from '../utils/openDataElementSelector';

// TODO: Replace with actual values from user's product level.
const maxItems = {
  eVar: 250,
  prop: 75
};

export default class EvarsPropsEditor extends React.Component {
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
            ref={`nameWrapper${index}`}
            error={variable.name.touched && variable.name.error}
            className="u-gapRight2x">
            <Coral.Select
              ref={`nameSelect${index}`}
              className="Field--short"
              placeholder={namePlaceholder}
              {...variable.name}>
              {nameOptions}
            </Coral.Select>
          </ValidationWrapper>
          <Coral.Select
            className="Field--short u-gapRight2x"
            {...variable.type}
            ref={`typeSelect${index}`}>
            <Coral.Select.Item
              value="value">
              Set as
            </Coral.Select.Item>
            <Coral.Select.Item
              value="alias">
              Duplicate from
            </Coral.Select.Item>
          </Coral.Select>
          <ValidationWrapper
            ref={`valueWrapper${index}`}
            error={variable.value.touched && variable.value.error}>
            {
              variable.type.value === 'value' ?
                <Coral.Textfield
                  ref={`valueTextfield${index}`}
                  className="Field--short"
                  {...variable.value}/> :
                <Coral.Select
                  ref={`valueSelect${index}`}
                  className="Field--short"
                  placeholder="Select variable"
                  {...variable.value}>
                  {valueOptions}
                </Coral.Select>
            }
            <DataElementSelectorButton
              className={classNames({'u-hidden': variable.type.value !== 'value'})}
              onClick={openDataElementSelector.bind(this, variable.value)}/>
          </ValidationWrapper>
          <Coral.Button
            ref={`removeButton${index}`}
            variant="quiet"
            icon="close"
            iconSize="XS"
            onClick={this.removeVariable.bind(this, index)}/>
        </div>
      );
    });

    return (
      <section>
        {rows}
        <Coral.Button
          ref="addEventButton"
          onClick={this.createEmptyRow}>
          Add {this.props.varType}
        </Coral.Button>
      </section>
    );
  }
}

export const getFormConfig = (varType, varTypePlural) => {
  return {
    fields: [
      `trackerProperties.${varTypePlural}[].id`,
      `trackerProperties.${varTypePlural}[].name`,
      `trackerProperties.${varTypePlural}[].type`,
      `trackerProperties.${varTypePlural}[].value`
    ],
    settingsToFormValues(values, options) {
      let variables = (options.settings.trackerProperties || {})[varTypePlural];

      variables = variables ? variables.slice() : [];

      // Add an extra object which will ensures that there is an empty row available for the user
      // to configure their next variable.
      variables.push({});

      variables.forEach(variable => {
        variable.id = createId();
        variable.type = variable.type || 'value';
      });

      return {
        ...values,
        trackerProperties: {
          ...values.trackerProperties,
          [varTypePlural]: variables
        }
      };
    },
    formValuesToSettings(settings, values) {
      const {
        trackerProperties
      } = values;

      const variables = trackerProperties[varTypePlural].filter(variable => {
        return variable.name;
      }).map(variable => {
        // Everything but id.
        return {
          name: variable.name,
          type: variable.type,
          value: variable.value
        };
      });

      settings = {
        ...settings
      };

      if (variables.length) {
        settings.trackerProperties = {
          ...settings.trackerProperties,
          [varTypePlural]: variables
        };
      }

      return settings;
    },
    validate(errors, values) {
      const variables = values.trackerProperties[varTypePlural];
      const configuredVariableNames = [];

      const variablesErrors = variables.map(variable => {
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

      return {
        ...errors,
        trackerProperties: {
          ...errors.trackerProperties,
          [varTypePlural]: variablesErrors
        }
      };
    }
  };
};

