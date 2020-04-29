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

function DecisionScopesComponent({ values, formikProps, options }) {
  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout
          tip="If you set decision scopes as a Data Element, that Data Element should return an array.
          Otherwise you could add decision scopes as constants."
        >
          <FieldLabel
            labelFor="decisionScopesType"
            label="Decision Scopes (optional)"
          />
        </InfoTipLayout>
        <WrappedField
          id="decisionScopesTypeField"
          name="option"
          component={RadioGroup}
          componentClassName="u-flexColumn"
        >
          <Radio
            data-test-id="constantOptionField"
            value={options.CONSTANT}
            label="Enter values"
          />
          <Radio
            data-test-id="dataElementOptionField"
            value={options.DATA_ELEMENT}
            label="Data Element"
          />
        </WrappedField>
      </div>
      {formikProps.values.option === options.DATA_ELEMENT ? (
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
      ) : null}
      {formikProps.values.option === options.CONSTANT ? (
        <div className="FieldSubset u-gapTop">
          <FieldArray
            name="decisionScopesArray"
            render={arrayHelpers => {
              return (
                <div className="u-gapTop">
                  {((Array.isArray(values.decisionScopesArray) &&
                    values.decisionScopesArray.length) ||
                    null) &&
                    values.decisionScopesArray.map((scope, index) => (
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
                          size="S"
                          onClick={() => {
                            arrayHelpers.remove(index);
                          }}
                        />
                      </div>
                    ))}
                  <div className="u-gapTop u-alignRight">
                    <Button
                      data-test-id="addDecisionScopeButton"
                      label="Add decision scope"
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
      ) : null}
    </div>
  );
}

DecisionScopesComponent.propTypes = {
  values: PropTypes.object,
  formikProps: PropTypes.object,
  options: PropTypes.object
};

export default DecisionScopesComponent;
