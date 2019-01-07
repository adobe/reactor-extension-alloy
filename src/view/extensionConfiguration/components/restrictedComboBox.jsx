import React, { Component } from 'react';
import Autocomplete from '@react/react-spectrum/Autocomplete';
import Textfield from '@react/react-spectrum/Textfield';
import Button from '@react/react-spectrum/Button';
import ChevronDownMedium from '@react/react-spectrum/Icon/core/ChevronDownMedium';
import classNames from 'classnames';

let id = 0;
class RestrictedComboBox extends Component {
  constructor(props) {
    super(props);
    id += 1;
    this.state = {
      inputValue: props.defaultValue || ''
    };
    this.comboBoxId = `restricted-combo-box-${id}`;
  }
  componentWillUnmount() {
    clearTimeout(this.hideMenuTimeout);
  }
  onButtonClick() {
    this.textfield.focus();
    this.autocomplete.toggleMenu();
  }
  onMenuShow() {
    this.setState({ isOpen: true });
  }
  onMenuHide() {
    this.setState({ isOpen: false });
  }
  onChange(value) {
    this.setState({
      inputValue: value
    });
  }
  onSelect(option) {
    const { onChange } = this.props;
    this.setState({
      inputValue: option.label
    });
    onChange(option.value);
    // Workaround for https://jira.corp.adobe.com/browse/RSP-307
    // Because we just changed inputValue, which will then
    // set the value prop of Autocomplete, the Autocomplete will try
    // to show the menu again. :/
    this.hideMenuTimeout = setTimeout(() => {
      this.autocomplete.hideMenu();
    });
  }
  onTextfieldBlur() {
    const { onChange, onBlur } = this.props;
    const { inputValue } = this.state;
    const filteredOptions = this.getFilteredOptions(inputValue);
    if (filteredOptions.length) {
      onChange(filteredOptions[0].value);
      onBlur(); // This makes redux set meta.touched
    } else {
      this.setState({
        inputValue: ''
      });
      onChange();
      onBlur(); // This makes redux set meta.touched
      // Workaround for https://jira.corp.adobe.com/browse/RSP-307
      // Because we just changed inputValue, which will then
      // set the value prop of Autocomplete, the Autocomplete will try
      // to show the menu again. :/
      this.hideMenuTimeout = setTimeout(() => {
        this.autocomplete.hideMenu();
      });
    }
  }
  getFilteredOptions(value) {
    const { options } = this.props;
    return options.filter(
      option => option.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  getCompletions() {
    const { inputValue } = this.state;
    return Promise.resolve(this.getFilteredOptions(inputValue));
  }
  render() {
    const { disabled, required, invalid, validationState, quiet, autoFocus, 
      meta: { touched } } = this.props;
    const { inputValue, isOpen } = this.state;
    return (
      <Autocomplete
        ref={ (autocomplete) => {
          this.autocomplete = autocomplete;
        }
        }
        className={ classNames(
          'spectrum-InputGroup',
          {
            'spectrum-InputGroup--quiet': quiet
          },
          'RestrictedComboBox-autocomplete'
        ) }
        getCompletions={ this.getCompletions.bind(this) }
        onChange={ this.onChange.bind(this) }
        onSelect={ this.onSelect.bind(this) }
        value={ inputValue }
        onMenuShow={ this.onMenuShow.bind(this) }
        onMenuHide={ this.onMenuHide.bind(this) }
      >
        <Textfield
          id={ this.comboBoxId }
          ref={ (textfield) => {
            this.textfield = textfield;
          } }
          className="spectrum-InputGroup-field"
          placeholder="Autocomplete..."
          onBlur={ this.onTextfieldBlur.bind(this) }
          disabled={ disabled }
          required={ required }
          validationState={ validationState }
          autocompleteInput
          quiet={ quiet }
          autoFocus={ autoFocus }
        />
        <Button
          id={ `${id}-button` }
          type="button"
          variant="field"
          onClick={ this.onButtonClick.bind(this) }
          onMouseDown={ e => e.preventDefault() }
          onMouseUp={ e => e.preventDefault() }
          disabled={ disabled }
          required={ required }
          invalid={ invalid }
          quiet={ quiet }
          selected={ isOpen }
          aria-label="Show suggestions"
          aria-labelledby={ `${this.comboBoxId} ${this.comboBoxId}-button` }
          tabIndex="-1"
        >
          <ChevronDownMedium size={ null } className="spectrum-InputGroup-icon" />
        </Button>
      </Autocomplete>
    );
  }
}
export default RestrictedComboBox;
