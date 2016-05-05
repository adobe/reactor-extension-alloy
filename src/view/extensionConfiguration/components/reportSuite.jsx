import React from 'react';
import ReactDom from 'react-dom';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import addDataElementToken from '../../utils/addDataElementToken';

const showSuggestions = event => {
  event.preventDefault();

  setTimeout(() => {
    const autocomplete = event.target;
    autocomplete.addSuggestions([
      {
        value: 'Report suite 1',
        content: 'Report suite 1'
      },
      {
        value: 'Report suite 2',
        content: 'Report suite 2'
      },
      {
        value: 'Report suite 3',
        content: 'Report suite 3'
      }
    ]);
  });
};

export default class ReportSuite extends React.Component {
  getAutocompleteInput = () => {
    const node = ReactDom.findDOMNode(this.refs.autocomplete);
    return node.querySelector('.coral-Autocomplete-input');
  };

  openSelectorCallback = dataElementName => {
    const input = this.getAutocompleteInput();
    input.value = addDataElementToken(input.value, dataElementName);

    input.focus();
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector(this.openSelectorCallback);
  };

  render() {
    return (
      <div className="ReportSuite-autocompleteField">
        <label className="Label">{this.props.label}</label>
        <div>
          <ValidationWrapper
            ref="validationWrapper"
            error={this.props.touched && this.props.error}>
            <Coral.Autocomplete
              placeholder="Add Report Suite(s)"
              ref="autocomplete"
              className="Field--large"
              onCoralAutocompleteShowSuggestions={showSuggestions}
              onChange={this.props.onChange}
              values={this.props.value}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
              multiple>
            </Coral.Autocomplete>
            <DataElementSelectorButton onClick={this.openSelector}/>
          </ValidationWrapper>
        </div>
      </div>
    );
  }
};
