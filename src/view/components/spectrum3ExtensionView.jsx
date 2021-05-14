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

import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import PropTypes from "prop-types";
import {
  IllustratedMessage,
  ProgressCircle,
  Heading,
  Content
} from "@adobe/react-spectrum";
import Error from "@spectrum-icons/illustrations/Error";
import FillParentAndCenterChildren from "./fillParentAndCenterChildren";
import useExtensionBridge from "../utils/useExtensionBridge";
import wrapValidateWithErrorLogging from "../utils/wrapValidateWithErrorLogging";

// This component sets up Formik and wires it up to Launch's extension bridge.
// It should be used for each view inside an extension.
const ExtensionView = ({
  getInitialValues,
  getSettings,
  validate,
  validationSchema,
  render
}) => {
  const formikProps = useFormik({
    enableReinitialize: true,
    onSubmit: () => {},
    validate: wrapValidateWithErrorLogging(validate),
    validationSchema,
    validateOnChange: false
  });
  const [initialized, setInitialized] = useState(false);
  const [runtimeError, setRuntimeError] = useState();
  const [initInfo, setInitInfo] = useState();

  const resetForm = (initialValues = {}) => {
    formikProps.resetForm({
      values: initialValues
    });
  };

  useExtensionBridge({
    init: ({ initInfo: _initInfo }) => {
      setInitInfo(_initInfo);
      const initialValuesPromise = new Promise((resolve, reject) => {
        // This is inside of a promise "executor" because we want to catch
        // any errors that may occur inside getInitialValues.
        // getInitialValues may return the initial values or a promise
        // that gets resolved with the initial values, which is why
        // we do the Promise.resolve here.
        Promise.resolve(getInitialValues({ initInfo: _initInfo })).then(
          resolve,
          reject
        );
      });
      return initialValuesPromise
        .then(initialValues => {
          resetForm(initialValues);
          setInitialized(true);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          setRuntimeError(error);
        });
    },
    getSettings: () => {
      return getSettings({
        values: formikProps.values,
        initInfo
      });
    },
    validate: () => {
      // The docs say that the promise submitForm returns
      // will be rejected if there are errors, but that is not the case.
      // Therefore, after the promise is resolved, we pull formikProps.errors
      // (which were set during submitForm()) to see if the form is valid.
      // https://github.com/jaredpalmer/formik/issues/1580
      return formikProps.submitForm().then(() => {
        formikProps.setSubmitting(false);
        return Object.keys(formikProps.errors).length === 0;
      });
    }
  });

  if (runtimeError) {
    return (
      <FillParentAndCenterChildren>
        <IllustratedMessage data-test-id="initializationErrorAlert">
          <Error />
          <Heading>An error occurred</Heading>
          <Content>{runtimeError.message}</Content>
        </IllustratedMessage>
      </FillParentAndCenterChildren>
    );
  }

  if (!initialized) {
    return (
      <FillParentAndCenterChildren>
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </FillParentAndCenterChildren>
    );
  }

  const renderAndCatchError = () => {
    try {
      return render({
        formikProps,
        initInfo,
        resetForm
      });
    } catch (e) {
      setRuntimeError(e);
      return null;
    }
  };

  return (
    <FormikProvider value={formikProps}>{renderAndCatchError()}</FormikProvider>
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
