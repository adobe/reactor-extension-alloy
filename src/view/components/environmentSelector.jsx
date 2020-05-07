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
import PropTypes from "prop-types";

import Alert from "@react/react-spectrum/Alert";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Textfield from "@react/react-spectrum/Textfield";
import Select from "@react/react-spectrum/Select";

import InfoTipLayout from "./infoTipLayout";
import "./environmentSelector.styl";

const EnvironmentSelector = ({
  label,
  infoTip,
  alertVariant,
  alertHeader,
  alertText,
  options,
  id,
  value,
  onChange,
  onBlur,
  "data-test-id": dataTestId,
  ...rest
}) => {
  return (
    <div className="EnvironmentSelector">
      <InfoTipLayout tip={infoTip}>
        <FieldLabel labelFor={`${id}Field`} label={label} />
      </InfoTipLayout>
      {options.length === 0 && (
        <Alert
          id={`${id}Field`}
          variant={alertVariant}
          header={alertHeader}
          className="u-fieldLong"
          data-test-id={`${dataTestId}Alert`}
          {...rest}
        >
          {alertText}
        </Alert>
      )}
      {options.length === 1 && (
        <Textfield
          id={`${id}Field`}
          className="u-fieldLong"
          value={options[0].label}
          disabled
          data-test-id={`${dataTestId}Field`}
          {...rest}
        />
      )}
      {options.length > 1 && (
        <Select
          id={`${id}Field`}
          options={options}
          className="u-fieldLong"
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          data-test-id={`${dataTestId}Select`}
          {...rest}
        />
      )}
    </div>
  );
};

EnvironmentSelector.propTypes = {
  label: PropTypes.string,
  infoTip: PropTypes.string,
  alertVariant: PropTypes.string,
  alertHeader: PropTypes.string,
  alertText: PropTypes.string,
  options: PropTypes.array,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  "data-test-id": PropTypes.string
};

export default EnvironmentSelector;
