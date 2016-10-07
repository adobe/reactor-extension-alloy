import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field, FieldArray } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';

import './hierarchiesEditor.styl';

const MAX_HIERARCHY_SECTIONS = 4;

const hierarchiesOptions = [{
  label: 'Hierarchy 1',
  value: 'hier1'
}, {
  label: 'Hierarchy 2',
  value: 'hier2'
}, {
  label: 'Hierarchy 3',
  value: 'hier3'
}, {
  label: 'Hierarchy 4',
  value: 'hier4'
}, {
  label: 'Hierarchy 5',
  value: 'hier5'
}];

const setDefaultsForHierarchy = hierarchy => {
  hierarchy.name = hierarchy.name || 'hier1';
  hierarchy.delimiter = hierarchy.delimiter || ',';
  hierarchy.sections = hierarchy.sections || [];

  for (let i = hierarchy.sections.length; i < MAX_HIERARCHY_SECTIONS; i++) {
    hierarchy.sections.push('');
  }

  return hierarchy;
};

const createEmptyRow = () => setDefaultsForHierarchy({});

const renderHierarchySections = ({ fields }) => {
  const rows = fields.map((field, index) => (
    <div key={ index } className="HierarchiesEditor-section">
      {
        index > 0 ?
          <span
            className={
              `HierarchiesEditor-nestIndicator HierarchiesEditor-nestIndicator--${index + 1}`
            }
          /> : null
      }

      <Field
        name={ `${field}` }
        component={ DecoratedInput }
        inputComponent={ Textfield }
        supportDataElement
      />
    </div>
  ));

  return (
    <div>
      { rows }
    </div>
  );
};

const renderHierarchies = ({ fields }) => {
  const rows = fields.map((field, index) => (
    <div data-row key={ index } className="HierarchiesEditor-hierarchy">
      <Field
        name={ `${field}.name` }
        className="u-gapRight2x"
        component={ DecoratedInput }
        inputComponent={ Select }
        inputClassName="Field--short"
        options={ hierarchiesOptions }
      />

      <label>
        <span className="Label u-gapRight">Delimiter</span>
        <Field
          name={ `${field}.delimiter` }
          className="u-gapRight"
          component={ DecoratedInput }
          inputComponent={ Textfield }
          inputClassName="Field--short"
        />
      </label>

      <Button
        variant="minimal"
        icon="close"
        square
        iconSize="XS"
        onClick={ fields.remove.bind(this, index) }
      />

      <FieldArray
        name={ `${field}.sections` }
        component={ renderHierarchySections }
      />
    </div>
  ));

  return (
    <div>
      { rows }
      <Button onClick={ () => fields.push(createEmptyRow()) }>Add hierarchy</Button>
    </div>
  );
};

export default () => (
  <FieldArray
    name="trackerProperties.hierarchies"
    component={ renderHierarchies }
  />
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    let {
      hierarchies
    } = settings.trackerProperties || {};

    hierarchies = hierarchies ? hierarchies.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next hierarchy.
    hierarchies.push(createEmptyRow());

    hierarchies.forEach(setDefaultsForHierarchy);

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        hierarchies
      }
    };
  },
  formValuesToSettings(settings, values) {
    let {
      hierarchies
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties
    };

    hierarchies = hierarchies
      .filter(hierarchy => hierarchy.sections.some(section => section))
      .map(hierarchy => ({
        ...hierarchy,
        // Notice we're cutting out unfilled sections. So if a user provides a value for
        // section 1 and section 4, we're collapsing it down to section 1 and section 2.
        // This was what was done before Reactor and seems reasonable.
        sections: hierarchy.sections.filter(section => section)
      }));

    if (hierarchies.length) {
      trackerProperties.hierarchies = hierarchies;
    }

    return {
      ...settings,
      trackerProperties
    };
  },
  validate(errors, values) {
    const trackerProperties = values.trackerProperties || {};
    const hierarchies = trackerProperties.hierarchies || [];

    const configuredHierarchyNames = [];

    const hierarchiesErrors = hierarchies.map(hierarchy => {
      const hierarchyErrors = {};

      // If a hierarchy has no populated sections then it won't get saved anyway so we can
      // skip validating it.
      if (hierarchy.sections.some(section => section)) {
        if (configuredHierarchyNames.indexOf(hierarchy.name) === -1) {
          configuredHierarchyNames.push(hierarchy.name);
        } else {
          hierarchyErrors.name = 'This hierarchy has already been configured';
        }

        if (!hierarchy.delimiter) {
          hierarchyErrors.delimiter = 'Please provide a delimiter';
        }
      }

      return hierarchyErrors;
    });

    return {
      ...errors,
      trackerProperties: {
        ...errors.trackerProperties,
        hierarchies: hierarchiesErrors
      }
    };
  }
};

