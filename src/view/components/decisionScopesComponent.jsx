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

import "regenerator-runtime"; // needed for some of react-spectrum
import React from "react";
import { FieldArray } from "formik";
import Button from "@react/react-spectrum/Button";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import PropTypes from "prop-types";
import Textfield from "@react/react-spectrum/Textfield";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Delete from "@react/react-spectrum/Icon/Delete";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import InfoTipLayout from "./infoTipLayout";
import WrappedField from "./wrappedField";

function DecisionScopesComponent({ values, options }) {
  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout
          tip="You may provide scopes as a data element or enter each scope individually.
           If a data element is provided, it must return an array of scopes."
        >
          <FieldLabel
            labelFor="decisionScopesType"
            label="Decision Scopes (optional)"
          />
        </InfoTipLayout>
        <WrappedField
          id="decisionScopesTypeField"
          name="decisionsInputMethod"
          component={RadioGroup}
          componentClassName="u-flexRow"
        >
          <Radio
            data-test-id="constantOptionField"
            value={options.CONSTANT}
            label="Enter values"
            className="u-gapLeft"
          />
          <Radio
            data-test-id="dataElementOptionField"
            value={options.DATA_ELEMENT}
            label="Data Element"
            className="u-gapLeft"
          />
        </WrappedField>
      </div>
      {values.decisionsInputMethod === options.DATA_ELEMENT && (
        <div className="FieldSubset u-gapTop">
          <div>
            <WrappedField
              data-test-id="scopeDataElementField"
              id="scopeDataElementField"
              name="decisionScopesDataElement"
              component={Textfield}
              componentClassName="u-fieldLong"
              supportDataElement="replace"
            />
          </div>
        </div>
      )}
      {values.decisionsInputMethod === options.CONSTANT && (
        <div className="FieldSubset u-gapTop">
          <FieldArray
            name="decisionScopesArray"
            render={arrayHelpers => {
              return (
                <div className="u-gapTop">
                  {values.decisionScopesArray.map((scope, index) => (
                    <div className="u-gapTop" key={index}>
                      <WrappedField
                        data-test-id={`scope${index}Field`}
                        id={`scope${index}Field`}
                        name={`decisionScopesArray.${index}`}
                        component={Textfield}
                        componentClassName="u-fieldLong"
                      />
                      <Button
                        data-test-id={`deleteScope${index}Button`}
                        icon={<Delete />}
                        disabled={values.decisionScopesArray.length === 1}
                        variant="tool"
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                      />
                    </div>
                  ))}
                  <div className="u-gapTop u-alignRight">
                    <Button
                      data-test-id="addDecisionScopeButton"
                      label="Add scope"
                      onClick={() => {
                        arrayHelpers.push("");
                      }}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

DecisionScopesComponent.propTypes = {
  values: PropTypes.object,
  options: PropTypes.object
};

export default DecisionScopesComponent;
