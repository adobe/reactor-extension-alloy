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
import WrappedField from "../../../components/wrappedField";
import { PARTS, WHOLE } from "../constants/populationStrategy";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";

/**
 * The form for editing a node that is an object type.
 */
const ObjectEdit = props => {
  const { formStateNode, fieldName } = props;
  const {
    isPartsPopulationStrategySupported,
    populationStrategy
  } = formStateNode;

  return (
    <div>
      {isPartsPopulationStrategySupported && (
        <WrappedField
          name={`${fieldName}.populationStrategy`}
          component={RadioGroup}
          className="u-gapBottom"
        >
          <Radio
            data-test-id="partsPopulationStrategyField"
            value={PARTS}
            label="Provide individual attributes"
          />
          <Radio
            data-test-id="wholePopulationStrategyField"
            value={WHOLE}
            label="Provide entire object"
            className="u-gapLeft2x"
          />
        </WrappedField>
      )}
      {populationStrategy === WHOLE && (
        <div className="u-gapTop">
          <FieldLabel
            labelFor="valueField"
            label="Data element providing object"
          />
          <WrappedField
            data-test-id="valueField"
            id="valueField"
            name={`${fieldName}.value`}
            component={Textfield}
            componentClassName="u-fieldLong"
            supportDataElement="replace"
          />
        </div>
      )}
    </div>
  );
};

ObjectEdit.propTypes = {
  formStateNode: formStateNodePropTypes.isRequired,
  fieldName: PropTypes.string.isRequired
};

export default ObjectEdit;
