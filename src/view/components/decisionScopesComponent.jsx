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
import { useWatch, useFieldArray } from "react-hook-form";
import { Radio, Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { RadioGroup, TextField } from "./hookFormReactSpectrum";
import DataElementSelector from "./dataElementSelector";
import { CONSTANT, DATA_ELEMENT } from "../constants/decisionScopesInputMethod";

function DecisionScopesComponent() {
  const decisionsInputMethod = useWatch({
    name: "decisionsInputMethod"
  });
  const decisionScopesArray = useWatch({
    name: "decisionScopesArray"
  });
  const {
    fields: decisionScopeFields,
    append: appendDecisionScope,
    remove: removeDecisionScope
  } = useFieldArray({
    name: "decisionScopesArray"
  });
  return (
    <div>
      <div className="u-gapBottom">
        <RadioGroup
          name="decisionsInputMethod"
          orientation="horizontal"
          label="Decision scopes"
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
          {decisionScopeFields.map((field, index) => {
            return (
              <div className="u-gapBottom" key={field.id}>
                <TextField
                  data-test-id={`scope${index}Field`}
                  name={`decisionScopesArray.${index}.value`}
                  width="size-5000"
                  defaultValue={field.value}
                  aria-label="Decision scope"
                />
                <Button
                  data-test-id={`deleteScope${index}Button`}
                  isQuiet
                  isDisabled={decisionScopesArray.length === 1}
                  variant="secondary"
                  onPress={() => {
                    removeDecisionScope(index);
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
          <div className="u-gapTop">
            <Button
              variant="secondary"
              data-test-id="addDecisionScopeButton"
              onPress={() => {
                appendDecisionScope({ value: "" });
              }}
            >
              Add scope
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DecisionScopesComponent;
