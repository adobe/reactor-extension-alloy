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
import { Radio, Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { useField, FieldArray } from "formik";
import { string } from "yup";
import { RadioGroup, TextField } from "./hookFormReactSpectrum";
import DataElementSelector from "./dataElementSelector";
import singleDataElementRegex from "../constants/singleDataElementRegex";

const CONSTANT = "constant";
const DATA_ELEMENT = "dataElement";

function DecisionScopes() {
  const [{ value: decisionsInputMethod }] = useField("decisionsInputMethod");
  const [{ value: decisionScopesArray }] = useField("decisionScopesArray");

  return (
    <div>
      <div className="u-gapBottom">
        <RadioGroup
          name="decisionsInputMethod"
          orientation="horizontal"
          label="Decision Scopes"
        >
          <Radio data-test-id="constantOptionField" value={CONSTANT}>
            Manually enter scopes
          </Radio>
          <Radio data-test-id="dataElementOptionField" value={DATA_ELEMENT}>
            Provide data element returning array of scopes
          </Radio>
        </RadioGroup>
      </div>
      {decisionsInputMethod === DATA_ELEMENT && (
        <div className="FieldSubset">
          <DataElementSelector>
            <TextField
              data-test-id="scopeDataElementField"
              name="decisionScopesDataElement"
              width="size-5000"
            />
          </DataElementSelector>
        </div>
      )}
      {decisionsInputMethod === CONSTANT && (
        <div className="FieldSubset">
          <FieldArray
            name="decisionScopesArray"
            render={arrayHelpers => {
              return (
                <div>
                  {decisionScopesArray.map((scope, index) => {
                    return (
                      <div className="u-gapBottom" key={index}>
                        <TextField
                          data-test-id={`scope${index}Field`}
                          name={`decisionScopesArray.${index}`}
                          width="size-5000"
                          aria-label="Decision scope"
                        />
                        <Button
                          data-test-id={`deleteScope${index}Button`}
                          isQuiet
                          isDisabled={decisionScopesArray.length === 1}
                          variant="secondary"
                          onPress={() => {
                            arrayHelpers.remove(index);
                          }}
                          aria-label="Remove decision scope"
                          UNSAFE_className="u-verticalCenterBottom"
                          minWidth={0}
                        >
                          <Delete />
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    variant="secondary"
                    data-test-id="addDecisionScopeButton"
                    onPress={() => {
                      arrayHelpers.push("");
                    }}
                  >
                    Add scope
                  </Button>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DecisionScopes;

export const getInitialValues = ({ initInfo }) => {
  const { decisionScopes } = initInfo.settings || {};
  if (Array.isArray(decisionScopes)) {
    return {
      decisionsInputMethod: CONSTANT,
      decisionScopesArray: decisionScopes,
      decisionScopesDataElement: ""
    };
  }
  if (typeof decisionScopes === "string") {
    return {
      decisionsInputMethod: DATA_ELEMENT,
      decisionScopesDataElement: decisionScopes,
      decisionScopesArray: [""]
    };
  }
  return {
    decisionsInputMethod: CONSTANT,
    decisionScopesDataElement: "",
    decisionScopesArray: [""]
  };
};

export const getSettings = ({ values }) => {
  if (
    values.decisionsInputMethod === DATA_ELEMENT &&
    values.decisionScopesDataElement
  ) {
    return { decisionScopes: values.decisionScopesDataElement };
  }

  if (
    values.decisionsInputMethod === CONSTANT &&
    values.decisionScopesArray.length > 0
  ) {
    const decisionScopes = values.decisionScopesArray.filter(
      scope => scope !== ""
    );
    if (decisionScopes.length) {
      return { decisionScopes };
    }
  }
  return undefined;
};

export const validationSchema = {
  decisionScopesDataElement: string().when("decisionsInputMethod", {
    is: DATA_ELEMENT,
    then: string().matches(
      singleDataElementRegex,
      "Please specify a data element"
    )
  })
};
