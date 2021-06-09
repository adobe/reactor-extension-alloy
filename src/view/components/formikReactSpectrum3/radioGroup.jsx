/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { createRef } from "react";
import PropTypes from "prop-types";
import { RadioGroup as ReactSpectrumRadioGroup } from "@adobe/react-spectrum";
import { useField } from "formik";
import FieldDescriptionAndError from "../fieldDescriptionAndError";

const RadioGroup = ({ name, children, description, width, ...otherProps }) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name
  );
  const radioGroupRef = createRef();
  // Not entirely sure this is the right approach, but there's
  // no onBlur prop for RadioGroup, so we wire up React Hook Form's
  // onBlur to every radio.
  const childrenWithOnBlur = React.Children.map(children, child => {
    return React.cloneElement(child, {
      onBlur: event => {
        // If the target that will receive focus is not a child of the
        // radio group, we know the radio group has lost focus.
        if (
          !radioGroupRef.current
            .UNSAFE_getDOMNode()
            .contains(event.relatedTarget)
        ) {
          setTouched(true);
        }
      }
    });
  });
  return (
    <FieldDescriptionAndError
      description={description}
      error={touched && error ? error : undefined}
      width={width}
    >
      <ReactSpectrumRadioGroup
        {...otherProps}
        ref={radioGroupRef}
        value={value}
        onChange={setValue}
        validationState={touched && error ? "invalid" : undefined}
        width={width}
      >
        {childrenWithOnBlur}
      </ReactSpectrumRadioGroup>
    </FieldDescriptionAndError>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  width: PropTypes.string
};

export default RadioGroup;
