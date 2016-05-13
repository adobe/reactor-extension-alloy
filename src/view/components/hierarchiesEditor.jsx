import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../utils/openDataElementSelector';
import createId from '../utils/createId';

const setDefaultsForHierarchy = hierarchy => {
  hierarchy.id = hierarchy.id || createId();
  hierarchy.name = hierarchy.name || 'hier1';
  hierarchy.delimiter = hierarchy.delimiter || ',';
  hierarchy.sections = hierarchy.sections || [];

  for (let i = hierarchy.sections.length; i < 5; i++) {
    hierarchy.sections.push('');
  }

  return hierarchy;
};

export default class PageviewsAndContent extends React.Component {
  createEmptyRow = () => {
    this.props.fields.trackerProperties.hierarchies.addField(setDefaultsForHierarchy({}));
  };

  removeHierarchy = index => {
    this.props.fields.trackerProperties.hierarchies.removeField(index);
  };

  render() {
    const {
      hierarchies
    } = this.props.fields.trackerProperties;

    const hierarchyRows = hierarchies.map((hierarchy, index) => {
      const {
        id,
        name,
        sections,
        delimiter
      } = hierarchy;

      return (
        <div key={id.value} className="HierarchiesEditor-hierarchy">
          <ValidationWrapper
            error={name.touched && name.error}
            className="u-gapRight2x">
            <Coral.Select {...name} ref={`hierarchiesSelect${index}`} className="Field--short">
              <Coral.Select.Item value="hier1">Hierarchy 1</Coral.Select.Item>
              <Coral.Select.Item value="hier2">Hierarchy 2</Coral.Select.Item>
              <Coral.Select.Item value="hier3">Hierarchy 3</Coral.Select.Item>
              <Coral.Select.Item value="hier4">Hierarchy 4</Coral.Select.Item>
              <Coral.Select.Item value="hier5">Hierarchy 5</Coral.Select.Item>
            </Coral.Select>
          </ValidationWrapper>

          <label>
            <span className="Label u-gapRight">Delimiter</span>
            <ValidationWrapper
              error={delimiter.touched && delimiter.error}
              className="u-gapRight">
              <Coral.Textfield
                className="Field--short"
                ref={`delimiter${index}`}
                {...delimiter}/>
            </ValidationWrapper>
          </label>

          {
            index !== hierarchies.length - 1 ?
              <Coral.Button
                ref="removeButton"
                variant="quiet"
                icon="close"
                iconSize="XS"
                onClick={this.removeHierarchy.bind(this, index)}/> : null
          }

          <div className="HierarchiesEditor-section">
            <Coral.Textfield
              ref={`section0${index}`}
              {...sections[0]}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, sections[0])}/>
          </div>

          <div className="HierarchiesEditor-section">
            <span 
              className="HierarchiesEditor-nestIndicator HierarchiesEditor-nestIndicator--2"/>
            <Coral.Textfield
              ref={`section1${index}`}
              {...sections[1]}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, sections[1])}/>
          </div>

          <div className="HierarchiesEditor-section">
            <span
              className="HierarchiesEditor-nestIndicator HierarchiesEditor-nestIndicator--3"/>
            <Coral.Textfield
              ref={`section2${index}`}
              {...sections[2]}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, sections[2])}/>
          </div>

          <div className="HierarchiesEditor-section">
            <span
              className="HierarchiesEditor-nestIndicator HierarchiesEditor-nestIndicator--4"/>
            <Coral.Textfield
              ref={`section3${index}`}
              {...sections[3]}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, sections[3])}/>
          </div>
        </div>
      );
    });

    return (
      <div>
        { hierarchyRows }
        <Coral.Button
          onClick={this.createEmptyRow}>Add hierarchy</Coral.Button>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'trackerProperties.hierarchies[].id',
    'trackerProperties.hierarchies[].name',
    'trackerProperties.hierarchies[].sections[]',
    'trackerProperties.hierarchies[].delimiter'
  ],
  settingsToFormValues(values, options) {
    let {
      hierarchies
    } = options.settings.trackerProperties || {};

    hierarchies = hierarchies ? hierarchies.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next hierarchy.
    hierarchies.push({});

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
      .filter(hierarchy => {
        return hierarchy.sections.some(section => section);
      })
      .map(hierarchy => {
        return {
          // Exclude ID since it was only used for rendering the view.
          name: hierarchy.name,
          sections: hierarchy.sections.filter(section => section),
          delimiter: hierarchy.delimiter
        };
      });

    if (hierarchies.length) {
      trackerProperties.hierarchies = hierarchies;
    }

    return {
      ...settings,
      trackerProperties
    };
  },
  validate(errors, values) {
    const {
      hierarchies
    } = values.trackerProperties;

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

