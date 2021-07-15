/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import PropTypes from "prop-types";
import Autocomplete from "@react/react-spectrum/Autocomplete";
import Button from "@react/react-spectrum/Button";
import ChevronDownMedium from "@react/react-spectrum/Icon/core/ChevronDownMedium";
import React from "react";
import Textfield from "@react/react-spectrum/Textfield";
import classNames from "classnames";

// Importing ComboBox brings in the correct styles for this component
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-imports
import ComboBox from "@react/react-spectrum/ComboBox";

// Mostly copied from react-spectrum/ComboBox, but uses getCompletions instead of options
class CompletionComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onMenuShow = this.onMenuShow.bind(this);
    this.onMenuHide = this.onMenuHide.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getCompletions = this.getCompletions.bind(this);
    this.setAutocompleteRef = this.setAutocompleteRef.bind(this);
    this.setTextFieldRef = this.setTextFieldRef.bind(this);
  }

  state = {
    open: false
  };

  onButtonClick() {
    this.textfield.focus();
    this.autocomplete.toggleMenu();
  }

  onMenuShow() {
    const { showMenu } = this.props;
    if (showMenu !== null) {
      this.setState({ open: true });
    }
  }

  onMenuHide() {
    const { showMenu } = this.props;
    this.changeSinceOpen = false;
    if (showMenu !== null) {
      this.setState({ open: false });
    }
  }

  onChange(value) {
    this.changeSinceOpen = true;
    const { onChange } = this.props;
    onChange(value);
  }

  getCompletions(text) {
    const { getCompletions } = this.props;

    if (this.changeSinceOpen) {
      return getCompletions(text);
    }

    // When you open it the first time it should show the completions as if there is no search term.
    return getCompletions("");
  }

  setAutocompleteRef = a => {
    this.autocomplete = a;
    return a;
  };

  setTextFieldRef = t => {
    this.textfield = t;
    return t;
  };

  render() {
    const {
      id = this.comboBoxId,
      className,
      value,
      disabled,
      required,
      invalid,
      quiet,
      onSelect,
      renderItem,
      onMenuToggle,
      showMenu,
      ...props
    } = this.props;
    const { open } = this.state;
    return (
      <Autocomplete
        className={classNames(
          "spectrum-InputGroup",
          {
            "spectrum-InputGroup--quiet": quiet
          },
          className
        )}
        ref={this.setAutocompleteRef}
        getCompletions={this.getCompletions}
        value={value}
        onChange={this.onChange}
        onSelect={onSelect}
        onMenuShow={this.onMenuShow}
        onMenuHide={this.onMenuHide}
        showMenu={open}
        onMenuToggle={onMenuToggle}
        renderItem={renderItem}
      >
        <Textfield
          className={classNames("spectrum-InputGroup-field")}
          {...props}
          id={id}
          ref={this.setTextFieldRef}
          disabled={disabled}
          required={required}
          invalid={invalid}
          autocompleteInput
          quiet={quiet}
        />
        <Button
          id={`${id}-button`}
          type="button"
          variant="field"
          onClick={this.onButtonClick}
          onMouseDown={e => e.preventDefault()}
          onMouseUp={e => e.preventDefault()}
          disabled={disabled}
          required={required}
          invalid={invalid}
          quiet={quiet}
          selected={showMenu !== undefined ? showMenu : open}
          tabIndex="-1"
        >
          <ChevronDownMedium size={null} className="spectrum-InputGroup-icon" />
        </Button>
      </Autocomplete>
    );
  }
}

CompletionComboBox.propTypes = {
  showMenu: PropTypes.bool,
  onChange: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  quiet: PropTypes.bool,
  onSelect: PropTypes.func,
  renderItem: PropTypes.func,
  onMenuToggle: PropTypes.func,
  getCompletions: PropTypes.func
};

export default CompletionComboBox;
