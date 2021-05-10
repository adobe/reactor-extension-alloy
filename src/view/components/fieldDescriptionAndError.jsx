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

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./fieldDescriptionAndError.styl";

// This is intended as a temporary solution until descriptions and errors
// supported natively in React-Spectrum.
// https://github.com/adobe/react-spectrum/issues/1346
const FieldDescriptionAndError = ({
  children,
  description,
  error,
  width,
  className
}) => {
  let messageClassName;
  let message;

  if (error) {
    messageClassName = "FieldDescriptionAndError-error";
    message = error;
  } else if (description) {
    messageClassName = "FieldDescriptionAndError-description";
    message = description;
  } else {
    return children;
  }

  // By providing a width directly on the error and description
  // divs, we ensure that the text wraps at the width of the field.
  // We're using the same CSS variables here that the field itself receives.
  // There may be a way to do all of this without Spectrum's CSS variables.
  const widthStyle = width
    ? `var(--spectrum-global-dimension-${width}, var(--spectrum-alias-${width}))`
    : `var(--spectrum-field-default-width)`;
  return (
    <div className="u-inlineFlex u-flexColumn u-gapBottom">
      {children}
      <div
        className={classNames(messageClassName, className)}
        style={{ width: widthStyle }}
      >
        {message}
      </div>
    </div>
  );
};

FieldDescriptionAndError.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  error: PropTypes.string,
  width: PropTypes.string,
  className: PropTypes.string
};

export default FieldDescriptionAndError;