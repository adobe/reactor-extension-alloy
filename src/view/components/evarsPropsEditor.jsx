import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import { DataElementSelectorButton } from '@reactor/react-components';
import classNames from 'classnames';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import createId from '../utils/createId';
import openDataElementSelector from '../utils/openDataElementSelector';

// TODO: Replace with actual values from user's product level.
const maxItems = {
  eVar: 250,
  prop: 75
};

const typeOptions = [{
  label: 'Set as',
  value: 'value'
},{
  label: 'Duplicate From',
  value: 'alias'
}];

export default class EvarsPropsEditor extends React.Component {
  createOptions = varType => {
    const options = [];
    const numItems = maxItems[varType];

    for (let i = 0; i < numItems; i++) {
      const value = varType + (i + 1);
      options.push({
        label: value,
        value
      });
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
            type="name"
            error={variable.name.touched && variable.name.error}
            className="u-gapRight2x">
            <Autocomplete
              className="Field--short"
              placeholder={namePlaceholder}
              {...variable.name}
              onBlur={() => variable.name.onBlur(variable.name.value)}
              options={nameOptions}/>
          </ValidationWrapper>
          <Select
            className="Field--short u-gapRight2x"
            {...variable.type}
            options={typeOptions}/>
          <ValidationWrapper
            type="value"
            error={variable.value.touched && variable.value.error}>
            {
              variable.type.value === 'value' ?
                <Textfield
                  className="Field--short"
                  {...variable.value}/> :
                <Autocomplete
                  className="Field--short"
                  placeholder="Select variable"
                  {...variable.value}
                  onBlur={() => variable.value.onBlur(variable.value.value)}
                  options={valueOptions}/>
            }
            <DataElementSelectorButton
              className={classNames({'u-hidden': variable.type.value !== 'value'})}
              onClick={openDataElementSelector.bind(this, variable.value)}/>
          </ValidationWrapper>
          <Button
            variant="minimal"
            square
            icon="close"
            iconSize="XS"
            onClick={this.removeVariable.bind(this, index)}/>
        </div>
      );
    });

    return (
      <section>
        {rows}
        <Button
          onClick={this.createEmptyRow}>
          Add {this.props.varType}
        </Button>
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
    validate(errors, values = { trackerProperties: {} }) {
      const variables = values.trackerProperties[varTypePlural] || [];
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

