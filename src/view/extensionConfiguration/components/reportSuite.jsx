import React from 'react';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import Tag from '@coralui/react-coral/lib/Tag';
import TagList from '@coralui/react-coral/lib/TagList';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import addDataElementToken from '../../utils/addDataElementToken';

import './reportSuite.styl';

const reportSuites = [
  {
    value: 'Report suite 1'
  }, {
    value: 'Report suite 2'
  }, {
    value: 'Report suite 3'
  }, {
    value: 'Report suite 4'
  }, {
    value: 'Report suite 5'
  }, {
    value: 'Report suite 6'
  }, {
    value: 'Report suite 7'
  }, {
    value: 'Report suite 8'
  }, {
    value: 'Report suite 9'
  }
];

export default class ReportSuite extends React.Component {
  onChange = (newValue) => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    const values = value ? value.slice() : [];

    if (values.indexOf(newValue) === -1) {
      values.push(newValue);
    }

    onChange(values);
  };

  onAutocompleteChange = (newValueArr) => {
    if (!newValueArr.length) {
      return;
    }

    const newValue = newValueArr.shift().value;
    this.onChange(newValue);
  };

  onRemove = (removedValue) => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    const values = value.slice() || [];
    const removedValueIndex = values.indexOf(removedValue);

    if (removedValueIndex !== -1) {
      values.splice(removedValueIndex, 1);
    }

    onChange(values);
  };

  getReportSuiteOptions = () => {
    const selectedValues = this.props.input.value;
    return reportSuites
      .filter(rs => selectedValues.indexOf(rs.value) === -1)
      .sort((a, b) => {
        const aValue = a.value.toLowerCase();
        const bValue = b.value.toLowerCase();

        if (aValue < bValue) {
          return -1;
        }

        if (aValue > bValue) {
          return 1;
        }

        return 0;
      });
  };

  openDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(dataElementName => {
      this.onChange(addDataElementToken('', dataElementName));
    });
  };

  render() {
    const {
      input: {
        value
      },
      meta: {
        touched,
        error
      },
      label
    } = this.props;

    const values = value || [];

    return (
      <div className="ReportSuite-autocompleteField">
        <label className="Label">{ label }</label>
        <div>
          <ValidationWrapper
            error={ touched && error }
          >
            <Autocomplete
              labelKey="value"
              onChange={ this.onAutocompleteChange }
              placeholder="Add Report Suite(s)"
              className="Field--long"
              options={ this.getReportSuiteOptions() }
              allowCreate
              multiple
            />
            <DataElementSelectorButton onClick={ this.openDataElementSelector } />
          </ValidationWrapper>
          <div>
            <TagList className="coral-Autocomplete-tagList" onClose={ this.onRemove }>
              {
                values.map(tag =>
                  <Tag
                    className="TagListEditor-tag"
                    key={ tag }
                    title={ tag }
                  >
                    { tag }
                  </Tag>
                )
              }
            </TagList>
          </div>
        </div>
      </div>
    );
  }
}
