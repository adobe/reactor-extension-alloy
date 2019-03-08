import React, { Component } from 'react';
import Autocomplete from '@react/react-spectrum/Autocomplete';
import Textfield from '@react/react-spectrum/Textfield';
import Button from '@react/react-spectrum/Button';
import ChevronDownMedium from '@react/react-spectrum/Icon/core/ChevronDownMedium';
import classNames from 'classnames';
import '@react/react-spectrum/ComboBox';

// imports the styles to combine the down button with the textbox
import InputGroup from '@react/react-spectrum/InputGroup';

let id = 0;
const getLabel = o => (typeof o === 'string' ? o : o.label);
const getValue = o => (typeof o === 'string' ? o : o.value);
const resolvePromise = (value, then) => {
  if (value && typeof value.then === 'function') {
    value.then(then);
  } else {
    then(value);
  }
}

class RestrictedComboBox extends Component {
  constructor(props) {
    super(props);
    id += 1;
    this.state = {
      inputValue: props.value || props.defaultValue || ''
    };
    this.comboBoxId = `restricted-combo-box-${id}`;
  }
  componentWillUnmount() {
    clearTimeout(this.hideMenuTimeout);
  }
  onButtonClick() {
    if (this.autocomplete.state.showDropdown) {
      this.autocomplete.hideMenu();
    } else {
      const { onChange } = this.props;
      this.setState({inputValue: ""});
      onChange("");
      this.textfield.focus();
      setTimeout(() => this.autocomplete.showMenu());
    }
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
      inputValue: getLabel(option)
    });
    onChange(getValue(option));
    // Workaround for https://jira.corp.adobe.com/browse/RSP-307
    // Because we just changed inputValue, which will then
    // set the value prop of Autocomplete, the Autocomplete will try
    // to show the menu again. :/
    this.hideMenuTimeout = setTimeout(() => {
      this.autocomplete.hideMenu();
    });
  }
  onTextfieldBlur() {
    const { onChange, onBlur, allowCreate } = this.props;
    const { inputValue } = this.state;

    if (allowCreate) {
      onChange(inputValue);
    } else {
      const filteredOptions = this.getFilteredOptions(inputValue);

      resolvePromise(filteredOptions, filteredOptions => {
        if (filteredOptions.length) {
          onChange(getValue(filteredOptions[0]));
          onBlur(); // This makes redux set meta.touched
        } else {
          this.setState({inputValue: ''});
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
      });
    }
  }
  getFilteredOptions(value) {
    const { options, getCompletions } = this.props;
    if (getCompletions) {
      return getCompletions(value);
    } else {
      return options.filter(
        option => getLabel(option).toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }
  getCompletions() {
    const { inputValue } = this.state;
    return Promise.resolve(this.getFilteredOptions(inputValue));
  }
  render() {
    const { 
      disabled,
      required,
      invalid,
      validationState,
      quiet,
      autoFocus,
      placeholder,
      allowCreate
    } = this.props;
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
        allowCreate={ allowCreate }
      >
        <Textfield
          id={ this.comboBoxId }
          ref={ (textfield) => {
            this.textfield = textfield;
          } }
          className="spectrum-InputGroup-field"
          placeholder={ placeholder }
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
