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
import { Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { FieldArray, useField } from "formik";
import { TextField } from "./formikReactSpectrum3";
import PartialForm from "./partialForm";
import DataElementRadioChoice from "./dataElementRadioChoice";

const getInitialValues = ({ initInfo }) => {
  const { decisionScopes } = initInfo.settings || {};
  if (!Array.isArray(decisionScopes) || decisionScopes.length === 0) {
    return { decisionScopes: [""] };
  }

  return {
    decisionScopes
  };
};

const getSettings = ({ values }) => {
  const decisionScopes = values.decisionScopes.filter(scope => scope !== "");
  if (decisionScopes.length === 0) {
    return {};
  }
  return { decisionScopes };
};

const DecisionScopes = () => {
  const [{ value: decisionScopes }] = useField("decisionScopes");

  return (
    <DataElementRadioChoice
      name="decisionScopesChoice"
      setting="decisionScopes"
      label="Decision Scopes"
      dataElementLabel="Provide a data element returning an array of scopes"
      constantLabel="Manually enter scopes"
    >
      <PartialForm
        getInitialValues={getInitialValues}
        getSettings={getSettings}
        name="decisionScopes"
        render={() => (
          <div className="FieldSubset">
            <FieldArray
              name="decisionScopes"
              render={arrayHelpers => {
                return (
                  <div>
                    {decisionScopes.map((scope, index) => {
                      return (
                        <div className="u-gapBottom" key={index}>
                          <TextField
                            data-test-id={`decisionScopes${index}Field`}
                            name={`decisionScopes[${index}]`}
                            width="size-5000"
                            aria-label="Decision scope"
                          />
                          <Button
                            data-test-id={`decisionScopes${index}DeleteButton`}
                            isQuiet
                            isDisabled={decisionScopes.length === 1}
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
      />
    </DataElementRadioChoice>
  );
};

export default DecisionScopes;
