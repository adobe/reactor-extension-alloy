import React from 'react';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import Tag from '@coralui/react-coral/lib/Tag';
import TagList from '@coralui/react-coral/lib/TagList';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';

import addDataElementToken from '../../utils/addDataElementToken';

const pushIfNotExist = (arr, value) => {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
};

const getUpdateReportSuiteOptions =
  (reportSuites, newValue) => reportSuites.filter((rs) => rs.value !== newValue);

export default class ReportSuite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reportSuites: [
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
      ]
    };
  }

  onChange = (newValue) => {
    const values = this.props.value || [];

    pushIfNotExist(values, newValue);
    this.state.reportSuites = getUpdateReportSuiteOptions(this.state.reportSuites, newValue);
    this.props.onChange(values);
  };

  onAutocompleteChange = (newValueArr) => {
    if (!newValueArr.length) {
      return;
    }

    const newValue = newValueArr.shift().value;
    this.onChange(newValue);
  };

  onRemove = (removedValue) => {
    if (!removedValue.match(/^%.*%$/g)) {
      this.state.reportSuites.push({ value: removedValue });
      this.state.reportSuites.sort((a, b) => {
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
    }
    this.props.onChange(this.props.value.filter((value) => value !== removedValue));
  };

  openSelectorCallback = dataElementName => {
    const newValue = addDataElementToken('', dataElementName);
    this.onChange(newValue);
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector(this.openSelectorCallback);
  };

  render() {
    const values = this.props.value || [];

    return (
      <div className="ReportSuite-autocompleteField">
        <label className="Label">{ this.props.label }</label>
        <div>
          <ValidationWrapper
            error={ this.props.touched && this.props.error }
          >
            <Autocomplete
              name={ this.props.name }
              labelKey="value"
              onChange={ this.onAutocompleteChange }
              placeholder="Add Report Suite(s)"
              className="Field--long"
              options={ this.state.reportSuites }
              multiple
            />
            <DataElementSelectorButton onClick={ this.openSelector } />
          </ValidationWrapper>
          <div>
            <TagList className="coral-Autocomplete-tagList" onClose={ this.onRemove }>
              { values.map(
                (tag) => (
                  <Tag
                    className="TagListEditor-tag"
                    key={ tag }
                    title={ tag }
                  >
                    { tag }
                  </Tag>
                )
              ) }
            </TagList>
          </div>
        </div>
      </div>
    );
  }
}
