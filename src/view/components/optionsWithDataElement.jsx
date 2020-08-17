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
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Textfield from "@react/react-spectrum/Textfield";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import InfoTipLayout from "./infoTipLayout";
import WrappedField from "./wrappedField";

const OptionsWithDataElement = ({
  label,
  infoTip,
  options,
  id,
  "data-test-id": dataTestId,
  name,
  values
}) => {
  return (
    <div className="u-gapTop">
      <InfoTipLayout tip={infoTip}>
        <FieldLabel labelFor={`${id}RadioGroup`} label={label} />
      </InfoTipLayout>
      <WrappedField
        id={`${id}RadioGroup`}
        name={`${name}.radio`}
        component={RadioGroup}
        componentClassName="u-flexColumn"
      >
        {options.map(({ value: optionValue, label: optionLabel }) => (
          <Radio
            key={optionValue}
            data-test-id={`${dataTestId}${optionLabel}Radio`}
            value={optionValue}
            label={optionLabel}
          />
        ))}
        <Radio
          data-test-id={`${dataTestId}DataElementRadio`}
          value="dataElement"
          label="Provided by data element"
        />
      </WrappedField>

      {values && values.radio === "dataElement" && (
        <div>
          <WrappedField
            id={`${id}DataElement`}
            data-test-id={`${dataTestId}DataElementField`}
            name={`${name}.dataElement`}
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement="replace"
          />
        </div>
      )}
    </div>
  );
};

OptionsWithDataElement.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  infoTip: PropTypes.string,
  id: PropTypes.string,
  "data-test-id": PropTypes.string,
  name: PropTypes.string,
  values: PropTypes.object
};

export default OptionsWithDataElement;
