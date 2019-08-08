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

const addDataElementToken = (value, dataElementToken) =>
  `${value || ""}${dataElementToken}`;

const noop = () => {};

export class DecoratedInput extends React.Component {
  openDataElementSelector = (tokenize = false) => () => {
    const {
      field: { onChange, value, name }
    } = this.props;

    // Whenever we're dealing with a data element token, we add it to whatever the existing value
    // is. If we're not dealing with a token, we replace the value entirely. This is just due
    // to how we want the UX to flow.
    window.extensionBridge
      .openDataElementSelector({
        tokenize
      })
      .then(dataElement => {
        const newValue = tokenize
          ? addDataElementToken(value, dataElement)
          : dataElement;
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
      supportDataElementName,
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

    if (FieldComponent === Radio || FieldComponent === Checkbox) {
      input.checked = Boolean(input.value);
    }

    input.onChange = value => {
      setFieldValue(input.name, value);
      onChangeDefinedOnProps(value);
    };

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
        {supportDataElement || supportDataElementName ? (
          <Button
            variant="tool"
            icon={<Data />}
            onClick={this.openDataElementSelector(supportDataElement)}
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
  supportDataElement: PropTypes.bool,
  supportDataElementName: PropTypes.bool,
  errorTooltipPlacement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

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
