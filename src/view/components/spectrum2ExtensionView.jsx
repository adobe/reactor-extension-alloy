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

import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import PropTypes from "prop-types";
import Alert from "@react/react-spectrum/Alert";
import Wait from "@react/react-spectrum/Wait";
import FillParentAndCenterChildren from "./fillParentAndCenterChildren";
import ErrorBoundary from "./errorBoundary";

// Without this, if an error is thrown during validation, Formik
// swallows the error and it's difficult to figure out where the problem is.
// https://github.com/jaredpalmer/formik/issues/1329
const wrapValidateWithErrorLogging = validate => {
  if (!validate) {
    return undefined;
  }

  return (...args) => {
    let result;
    try {
      result = validate(...args);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error executing validation", error);
      throw error;
    }
    return result;
  };
};

const bridgeState = {
  getInitialValues: null,
  getSettings: null,
  setInitialValues: null,
  setInitializationError: null,
  initInfo: null,
  formikProps: null
};

const registerWithExtensionBridge = () => {
  window.extensionBridge.register({
    init: initInfo => {
      bridgeState.initInfo = initInfo;
      const initialValuesPromise = new Promise((resolve, reject) => {
        // This is inside of a promise "executor" because we want to catch
        // any errors that may occur inside getInitialValues.
        // getInitialValues may return the initial values or a promise
        // that gets resolved with the initial values, which is why
        // we do the Promise.resolve here.
        Promise.resolve(bridgeState.getInitialValues({ initInfo })).then(
          resolve,
          reject
        );
      });
      initialValuesPromise
        .then(_initialValues => {
          bridgeState.setInitialValues(_initialValues);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          bridgeState.setInitializationError(error);
        });
    },
    getSettings: () => {
      return bridgeState.getSettings({
        values: bridgeState.formikProps.values,
        initInfo: bridgeState.initInfo
      });
    },
    validate: () => {
      // The docs say that the promise submitForm returns
      // will be rejected if there are errors, but that is not the case.
      // Therefore, after the promise is resolved, we pull formikProps.errors
      // (which were set during submitForm()) to see if the form is valid.
      // https://github.com/jaredpalmer/formik/issues/1580
      return bridgeState.formikProps.submitForm().then(() => {
        bridgeState.formikProps.setSubmitting(false);
        return Object.keys(bridgeState.formikProps.errors).length === 0;
      });
    }
  });
};

// This component sets up Formik and wires it up to Launch's extension bridge.
// It should be used for each view inside an extension.
const ExtensionView = ({
  getInitialValues,
  getSettings,
  validate,
  validationSchema,
  render
}) => {
  const [initialValues, setInitialValues] = useState();
  const [initializationError, setInitializationError] = useState();

  bridgeState.getInitialValues = getInitialValues;
  bridgeState.getSettings = getSettings;
  bridgeState.setInitialValues = setInitialValues;
  bridgeState.setInitializationError = setInitializationError;

  useEffect(registerWithExtensionBridge, []);

  if (initializationError) {
    return (
      <FillParentAndCenterChildren>
        <Alert
          data-test-id="initializationErrorAlert"
          header="Initialization Error"
          variant="error"
        >
          An error occurred during initialization: {initializationError.message}
        </Alert>
      </FillParentAndCenterChildren>
    );
  }

  if (initialValues) {
    return (
      <ErrorBoundary>
        <Formik
          enableReinitialize
          onSubmit={() => {}}
          initialValues={initialValues}
          validate={wrapValidateWithErrorLogging(validate)}
          validationSchema={validationSchema}
          render={formikProps => {
            bridgeState.formikProps = formikProps;
            return render({
              formikProps,
              initInfo: bridgeState.initInfo,
              resetForm: setInitialValues
            });
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <FillParentAndCenterChildren>
      <Wait size="L" />
    </FillParentAndCenterChildren>
  );
};

ExtensionView.propTypes = {
  getInitialValues: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  validate: PropTypes.func,
  validationSchema: PropTypes.object,
  render: PropTypes.func.isRequired
};

export default ExtensionView;
