import React from 'react';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import { ErrorTip, DataElementSelectorButton } from '@reactor/react-components';

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
  onChange = (newValueArr) => {
    const {
      input: {
        onChange
      }
    } = this.props;

    onChange(newValueArr);
  };

  openDataElementSelector = () => {
    window.extensionBridge.openDataElementSelector(dataElementName => {
      const dataElementDoesNotExist =
        reportSuites.filter((rs) => rs.value === dataElementName).length === 0;

      if (dataElementDoesNotExist) {
        const {
          input: {
            onChange,
            value
          }
        } = this.props;

        reportSuites.push({
          value: addDataElementToken('', dataElementName)
        });

        const newValue = value || [];

        newValue.push({
          value: addDataElementToken('', dataElementName)
        });

        onChange(newValue);
        this.forceUpdate();
      }
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

    return (
      <div className="ReportSuite-autocompleteField">
        <label className="Label">{ label }</label>
        <div>
          <Autocomplete
            labelKey="value"
            onChange={ this.onChange }
            value={ value }
            placeholder="Add Report Suite(s)"
            className="Field--long"
            options={ reportSuites }
            allowCreate
            multiple
            invalid={ Boolean(touched && error) }
          />
          { touched && error ? <ErrorTip>{ error }</ErrorTip> : null }
          <DataElementSelectorButton onClick={ this.openDataElementSelector } />
        </div>
      </div>
    );
  }
}
