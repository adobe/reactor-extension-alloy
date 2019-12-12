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

import React from "react";
import { Field } from "formik";
import PropTypes from "prop-types";
import Button from "@react/react-spectrum/Button";
import Textfield from "@react/react-spectrum/Textfield";
import Checkbox from "@react/react-spectrum/Checkbox";
import Radio from "@react/react-spectrum/Radio";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Data from "@react/react-spectrum/Icon/Data";
import ValidationWrapper from "./validationWrapper";

const getNestedValue = (obj, path) => {
  if (obj[path]) {
    return obj[path];
  }

  const parts = path.split(".");

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (obj[part]) {
      // eslint-disable-next-line no-param-reassign
      obj = obj[part];
    } else {
      return obj[part];
    }
  }

  return obj;
};

const noop = () => {};

export class DecoratedInput extends React.Component {
  openDataElementSelector = () => {
    const {
      field: { onChange, value = "", name },
      supportDataElement
    } = this.props;

    // Whenever we're dealing with a data element token, we add it to whatever the existing value
    // is. If we're not dealing with a token, we replace the value entirely. This is just due
    // to how we want the UX to flow.
    window.extensionBridge.openDataElementSelector().then(dataElement => {
      const newValue =
        supportDataElement === "replace"
          ? dataElement
          : `${value}${dataElement}`;
      onChange(newValue, { target: { value: newValue, name } });
    });
  };

  render() {
    const {
      fieldComponent: FieldComponent,
      className,
      componentClassName,
      field: input,
      form: { touched, errors, setFieldValue },
      children,
      supportDataElement,
      errorTooltipPlacement,
      onChange: onChangeDefinedOnProps = noop,
      onBlur: onBlurDefinedOnProps = noop,
      ...rest
    } = this.props;

    const { onBlur } = input;

    input.onBlur = e => {
      onBlur(e);
      onBlurDefinedOnProps(e);
    };

    input.onChange = value => {
      setFieldValue(input.name, value);
      onChangeDefinedOnProps(value);
    };

    if (FieldComponent === Radio || FieldComponent === Checkbox) {
      input.checked = Boolean(input.value);
    }

    // Unlike other components, RadioGroup's "value" prop is named "selectedValue". :/
    if (FieldComponent === RadioGroup) {
      input.selectedValue = input.value;
    }

    const fieldComponentsProps = {
      ...input,
      ...rest,
      className: componentClassName
    };

    let errorToShow;

    const isTouched = getNestedValue(touched, input.name);

    if (isTouched) {
      errorToShow = getNestedValue(errors, input.name);

      if (errorToShow) {
        if (FieldComponent === Textfield) {
          fieldComponentsProps.validationState = "invalid";
        } else {
          fieldComponentsProps.invalid = true;
        }
      }
    }

    return (
      <ValidationWrapper
        className={className}
        error={errorToShow}
        placement={errorTooltipPlacement}
      >
        <FieldComponent {...fieldComponentsProps}>{children}</FieldComponent>
        {supportDataElement ? (
          <Button
            variant="tool"
            icon={<Data />}
            onClick={this.openDataElementSelector}
          />
        ) : null}
      </ValidationWrapper>
    );
  }
}

DecoratedInput.propTypes = {
  fieldComponent: PropTypes.elementType.isRequired,
  className: PropTypes.string,
  componentClassName: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  field: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  form: PropTypes.object.isRequired,
  children: PropTypes.node,
  supportDataElement: PropTypes.string,
  errorTooltipPlacement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

// Formik works well with native DOM elements, but we have some things
// that are unique:
// (1) We use react-spectrum, whose components have their own APIs.
// We need to connect those APIs to Formik APIs, such that when Formik
// states change, the components reflect those changes, and vice versa.
// (2) We use react-spectrum validation components, which include a red
// validation border and a tooltip that shows up on hover.
// (3) We often support data elements, which involved a button next
// to the textfield that, which clicked, pops up the data element
// selector (provided by Launch), then appends the selected data element
// to the textfield value.
// This class abstracts these details away so we can use simple APIs
// when building our forms.
const WrappedField = ({ component: Component, ...rest }) => {
  const fieldProps = {
    component: DecoratedInput,
    fieldComponent: Component,
    ...rest
  };

  return <Field {...fieldProps} />;
};

WrappedField.propTypes = {
  component: PropTypes.elementType.isRequired
};

export default WrappedField;
