import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Autocomplete from '@coralui/redux-form-react-coral/lib/Autocomplete';
import { Field, FieldArray, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

// TODO: Replace with actual values from user's product level.
const maxItems = {
  eVar: 250,
  prop: 75
};

const TYPES = {
  VALUE: 'value',
  ALIAS: 'alias'
};

const typeOptions = [{
  label: 'Set as',
  value: TYPES.VALUE
}, {
  label: 'Duplicate From',
  value: TYPES.ALIAS
}];

const createEmptyRow = () => ({ type: 'value' });

const createOptions = varType => {
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

const valueOptions = createOptions('eVar').concat(createOptions('prop'));

const nameOptionsCache = {};

let renderVariables = ({ fields, varType, varTypePlural, trackerProperties, dispatch }) => {
  if (!nameOptionsCache[varType]) {
    nameOptionsCache[varType] = createOptions(varType);
  }

  const nameOptions = nameOptionsCache[varType];
  const variables = trackerProperties[varTypePlural];

  const rows = fields.map((field, index) => {
    const { type } = variables[index];

    let valueFieldProps;

    if (type === TYPES.VALUE) {
      valueFieldProps = {
        inputComponent: Textfield,
        supportDataElement: true
      };
    } else {
      valueFieldProps = {
        inputComponent: Autocomplete,
        placeholder: 'Select variable',
        options: valueOptions
      };
    }

    return (
      <div
        data-row
        key={ index }
        className="u-gapBottom2x"
      >
        <Field
          name={ `${field}.name` }
          className="u-gapRight2x"
          component={ DecoratedInput }
          inputComponent={ Autocomplete }
          inputClassName="Field--short"
          placeholder={ `Select ${varType}` }
          options={ nameOptions }
        />

        <Field
          name={ `${field}.type` }
          className="u-gapRight2x Field--short"
          component={ Select }
          options={ typeOptions }
          onChange={ () => dispatch(change('default', `${field}.value`, '')) }
        />

        <Field
          // Because of https://github.com/erikras/redux-form/issues/1785 we have to
          // set all the same props for all types. It will throw a warning though, sadly. :(
          name={ `${field}.value` }
          component={ DecoratedInput }
          inputClassName="Field--short"
          { ...valueFieldProps }
        />

        <Button
          variant="minimal"
          square
          icon="close"
          iconSize="XS"
          onClick={ fields.remove.bind(this, index) }
        />
      </div>
    );
  });

  return (
    <section>
      { rows }
      <Button
        onClick={ () => fields.push(createEmptyRow()) }
      >
        Add { varType }
      </Button>
    </section>
  );
};

renderVariables = connect(
  state => ({ trackerProperties: formValueSelector('default')(state, 'trackerProperties') })
)(renderVariables);

export default ({ varType, varTypePlural }) => (
  <FieldArray
    name={ `trackerProperties.${varTypePlural}` }
    component={ renderVariables }
    varType={ varType }
    varTypePlural={ varTypePlural }
  />
);

export const getFormConfig = (varType, varTypePlural) => ({
  settingsToFormValues(values, settings) {
    let variables = (settings.trackerProperties || {})[varTypePlural];

    variables = variables ? variables.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next variable.
    variables.push(createEmptyRow());

    variables.map(variable => ({
      ...variable,
      type: variable.type || 'value'
    }));

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

    const variables = trackerProperties[varTypePlural]
      .filter(variable => variable.name)
      .map(variable => ({ ...variable }));

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
    const trackerProperties = values.trackerProperties || {};
    const variables = trackerProperties[varTypePlural] || [];
    const configuredVariableNames = [];

    const variablesErrors = variables.map(variable => {
      const variableErrors = {};

      if (variable.name) {
        if (configuredVariableNames.indexOf(variable.name) === -1) {
          configuredVariableNames.push(variable.name);
        } else {
          variableErrors.name = `This ${varType} is already configured`;
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
});

