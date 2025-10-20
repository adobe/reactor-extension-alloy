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
import { Item } from "@adobe/react-spectrum";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import FormikKeyedComboBox from "../formikReactSpectrum3/formikKeyedComboBox";
import DataElementSelector from "../dataElementSelector";
import appendSentence from "./helpers/appendSentence";

const StringEdit = (props) => {
  const { displayName, fieldName, description, possibleValues } = props;

  return (
    <div>
      <DataElementSelector>
        {possibleValues ? (
          <FormikKeyedComboBox
            data-test-id="valueField"
            label={displayName}
            name={`${fieldName}.value`}
            width="size-5000"
            items={possibleValues}
            getKey={(item) => item.value}
            getLabel={(item) => item.label}
            allowsCustomValue
            description={appendSentence(
              description,
              "Custom values are supported.",
            )}
          >
            {(item) => (
              <Item key={item.value} data-test-id={item.value}>
                {item.label}
              </Item>
            )}
          </FormikKeyedComboBox>
        ) : (
          <FormikTextField
            data-test-id="valueField"
            name={`${fieldName}.value`}
            label={displayName}
            width="size-5000"
            description={description}
          />
        )}
      </DataElementSelector>
    </div>
  );
};

StringEdit.propTypes = {
  displayName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  description: PropTypes.string,
  possibleValues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
};

export default StringEdit;
