/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';
import ComboBox from '@react/react-spectrum/ComboBox';
import Close from '@react/react-spectrum/Icon/Close';
import { FieldArray, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import WrappedField from '../extensionConfiguration/components/wrappedField';
import LIMITS, { LIMITS_LEVELS_LABELS, maxLevel } from '../enums/accessLevelLimits';
import COMPONENT_NAMES from '../enums/componentNames';

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

const createOptions = (varType) => {
  const options = [];
  const numItems = maxLevel(varType);

  for (let i = 0; i < numItems; i++) {
    const value = varType + (i + 1);
    let label = value;
    const accessLevels = [];

    Object.keys(LIMITS_LEVELS_LABELS).forEach((accessLevel) => {
      if (i + 1 <= LIMITS[varType][accessLevel]) {
        accessLevels.push(LIMITS_LEVELS_LABELS[accessLevel]);
      }
    });

    if (accessLevels.length !== Object.keys(LIMITS_LEVELS_LABELS).length) {
      label += ` (${accessLevels.join(', ')})`;
    }

    options.push({
      label,
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
        inputComponent: ComboBox,
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
        <WrappedField
          name={ `${field}.name` }
          className="u-gapRight2x"
          component={ ComboBox }
          placeholder={ `Select ${varType}` }
          options={ nameOptions }
        />

        <WrappedField
          name={ `${field}.type` }
          className="u-gapRight2x Field--short"
          component={ ComboBox }
          options={ typeOptions }
          onChange={ () => dispatch(change('default', `${field}.value`, '')) }
        />

        <WrappedField
          // Because of https://github.com/erikras/redux-form/issues/1785 we have to
          // set all the same props for all types. It will throw a warning though, sadly. :(
          name={ `${field}.value` }
          component={ ComboBox }
          inputClassName="leField--short"
          { ...valueFieldProps }
        />

        <Button
          variant="tool"
          square
          icon={ <Close size="XS" /> }
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
        Add Another
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
    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    const variablesErrors = variables.map((variable) => {
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

    if (Object.keys(variablesErrors.filter(r => r.name || r.value)).length) {
      componentsWithErrors.push(COMPONENT_NAMES[varTypePlural.toUpperCase()]);
    }

    return {
      ...errors,
      componentsWithErrors,
      trackerProperties: {
        ...errors.trackerProperties,
        [varTypePlural]: variablesErrors
      }
    };
  }
});

