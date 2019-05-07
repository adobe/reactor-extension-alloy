/***************************************************************************************
 * (c) 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React, { useState, useEffect } from "react";
import ErrorBoundary from "./errorBoundary";
import { Formik } from "formik";

let formikProps;

export default ({
  getInitialValues,
  getSettings,
  validationSchema,
  render
}) => {
  const [{ initialized, initialValues }, setState] = useState({
    initialized: false,
    initialValues: {}
  });

  useEffect(() => {
    window.extensionBridge.register({
      init: options => {
        setState({
          initialized: true,
          initialValues: getInitialValues(options.settings)
        });
      },
      getSettings: () => {
        return getSettings(formikProps.values);
      },
      validate: () => {
        const { submitForm, errors } = formikProps;
        return submitForm().then(() => Object.keys(errors).length === 0);
      }
    });
  }, []);

  return initialized ? (
    <ErrorBoundary>
      <Formik
        onSubmit={() => {}}
        initialValues={initialValues}
        validationSchema={validationSchema}
        render={_formikProps => {
          formikProps = _formikProps;
          return render(formikProps);
        }}
      />
    </ErrorBoundary>
  ) : null;
};
