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
import { Radio } from "@adobe/react-spectrum";
import { useField } from "formik";
import FormikRadioGroup from "../../../components/formikReactSpectrum3/formikRadioGroup";
import FormikTextField from "../../../components/formikReactSpectrum3/formikTextField";
import DataElementSelector from "../../../components/dataElementSelector";
import { PARTS, WHOLE } from "../constants/populationStrategy";

/**
 * The form for editing a node that is an object type.
 */
const ObjectEdit = ({ fieldName }) => {
  const [{ value: formStateNode }] = useField(fieldName);

  const {
    isPartsPopulationStrategySupported,
    populationStrategy
  } = formStateNode;

  return (
    <div>
      {isPartsPopulationStrategySupported && (
        <FormikRadioGroup
          label="Population Strategy"
          name={`${fieldName}.populationStrategy`}
          orientation="horizontal"
          UNSAFE_className="u-gapBottom"
        >
          <Radio data-test-id="partsPopulationStrategyField" value={PARTS}>
            Provide individual attributes
          </Radio>
          <Radio data-test-id="wholePopulationStrategyField" value={WHOLE}>
            Provide entire object
          </Radio>
        </FormikRadioGroup>
      )}
      {populationStrategy === WHOLE && (
        <div className="u-gapTop">
          <DataElementSelector>
            <FormikTextField
              data-test-id="valueField"
              name={`${fieldName}.value`}
              label="Data Element"
              description="This data element should resolve to an object."
              width="size-5000"
            />
          </DataElementSelector>
        </div>
      )}
    </div>
  );
};

ObjectEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default ObjectEdit;
