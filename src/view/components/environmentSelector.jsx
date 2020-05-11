/*
Copyright 2020 Adobe. All rights reserved.
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
          {...rest}
          className="u-fieldLong"
          data-test-id={`${dataTestId}Alert`}
        >
          {alertText}
        </Alert>
      )}
      {options.length === 1 && (
        <Textfield
          id={`${id}Field`}
          {...rest}
          className="u-fieldLong"
          value={options[0].label}
          data-test-id={`${dataTestId}Field`}
          disabled
        />
      )}
      {options.length > 1 && (
        <Select
          id={`${id}Field`}
          options={options}
          {...rest}
          className="u-fieldLong"
          data-test-id={`${dataTestId}Select`}
          required
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
  "data-test-id": PropTypes.string
};

export default EnvironmentSelector;
