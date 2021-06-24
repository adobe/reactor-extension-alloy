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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { object } from "yup";
import { Form, Radio } from "@adobe/react-spectrum";
import render from "../spectrum3Render";
import ExtensionView from "../components/spectrum3ExtensionView";
import ExtensionViewForm from "../components/extensionViewForm";
import RadioGroupWithDataElement, {
  createRadioGroupWithDataElementValidationSchema
} from "../components/formikReactSpectrum3/radioGroupWithDataElement";

const getInitialValues = ({ initInfo }) => {
  const { field1 = "a" } = initInfo.settings || {};

  return {
    field1
  };
};

const getSettings = ({ values }) => {
  return {
    field1: values.field1
  };
};

const validationSchema = object().shape({
  field1: createRadioGroupWithDataElementValidationSchema("field1")
});

const Test = ({ initInfo, formikProps, registerImperativeFormApi }) => {
  useEffect(() => {
    registerImperativeFormApi({
      getSettings,
      formikStateValidationSchema: validationSchema
    });
    formikProps.resetForm({ values: getInitialValues({ initInfo }) });
  }, []);

  // Formik state won't have values on the first render.
  if (!formikProps.values) {
    return null;
  }

  return (
    <Form>
      <RadioGroupWithDataElement
        name="field1"
        label="Field 1"
        description="My Description"
        dataElementDescription="My Data Element Description"
        width="size-5000"
      >
        <Radio value="a" data-test-id="field1ARadio">
          Option A
        </Radio>
        <Radio value="b" data-test-id="field1BRadio">
          Option B
        </Radio>
        <Radio value data-test-id="field1TrueRadio">
          Option true
        </Radio>
        <Radio value={false} data-test-id="field1FalseRadio">
          Option false
        </Radio>
      </RadioGroupWithDataElement>
    </Form>
  );
};

Test.propTypes = {
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  registerImperativeFormApi: PropTypes.func
};

const TestExtensionView = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <ExtensionViewForm
            render={props => {
              return <Test {...props} />;
            }}
          />
        );
      }}
    />
  );
};

render(TestExtensionView);
