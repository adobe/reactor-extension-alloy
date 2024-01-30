/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import { Checkbox } from "@adobe/react-spectrum";
import FormikCheckboxGroup from "../../../components/formikReactSpectrum3/formikCheckboxGroup";
import FieldSubset from "../../../components/fieldSubset";
import { XDM } from "../constants/variableTypes";

export const bridge = {
  async getInitialValues({ initInfo }) {
    const settings = initInfo.settings || {};
    const { solutions = [] } = settings;

    const initialValues = {
      solutions
    };

    return initialValues;
  },
  getSettings({ values }) {
    const result = {};
    const { solutions = [], type } = values;

    if (type === XDM) {
      return {};
    }

    if (solutions.length > 0) {
      result.solutions = solutions;
    }

    return result;
  },
  validateFormikState: ({ type, solutions }) => {
    const result = {};

    if (type === XDM) return result;

    if (!solutions || solutions.length < 1) {
      result.solutions = "Please select at least one Adobe solution.";
    }

    return result;
  }
};

const solutionsContext = [
  ["analytics", "Adobe Analytics"],
  ["target", "Adobe Target"],
  ["audienceManager", "Adobe Audience Manager"]
];

const DataVariable = () => (
  <FieldSubset>
    <FormikCheckboxGroup label="Solutions" name="solutions">
      {solutionsContext.map(([solution, name]) => {
        return (
          <Checkbox
            key={solution}
            data-test-id={solution}
            value={solution}
            width="size-5000"
          >
            {name}
          </Checkbox>
        );
      })}
    </FormikCheckboxGroup>
  </FieldSubset>
);

DataVariable.propTypes = {};

export default DataVariable;
