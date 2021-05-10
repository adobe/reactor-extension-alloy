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

import React, { useRef, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
  IllustratedMessage,
  ProgressCircle,
  Heading,
  Content
} from "@adobe/react-spectrum";
import Error from "@spectrum-icons/illustrations/Error";

import FillParentAndCenterChildren from "./fillParentAndCenterChildren";

const useExtensionBridge = currentViewMethods => {
  const viewMethods = useRef();
  viewMethods.current = currentViewMethods;

  useEffect(() => {
    // We use "useRef" so that whenever Launch calls the init, getSettings, or validate
    // methods below, we can be sure we're executing the view methods from the most
    // recent render. If our init, getSettings, and validate functions below referenced
    // currentViewMethods directly, currentViewMethods would be captured via closure
    // the first time useExtensionBridge is executed and those references
    // would never be updated on subsequent executions of useExtensionBridge, since
    // this effect only runs once.
    window.extensionBridge.register({
      init(initInfo) {
        return viewMethods.current.init({
          initInfo
        });
      },
      getSettings() {
        return viewMethods.current.getSettings();
      },
      validate() {
        return viewMethods.current.validate();
      }
    });
  }, []);
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
  const formMethods = useForm({
    mode: "onTouched",
    resolver: validationSchema ? yupResolver(validationSchema) : validate
  });
  const [initialized, setInitialized] = useState(false);
  const [runtimeError, setRuntimeError] = useState();
  const [initInfo, setInitInfo] = useState();

  const setInitialValues = (initialValues = {}) => {
    formMethods.reset(initialValues);
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
          setInitialValues(initialValues);
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
        values: formMethods.getValues(),
        initInfo
      });
    },
    validate: () => {
      return formMethods.trigger();
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

  if (initialized) {
    const renderAndCatchError = () => {
      try {
        return render({
          initInfo,
          resetForm: setInitialValues
        });
      } catch (e) {
        setRuntimeError(e);
        return null;
      }
    };

    return (
      <FormProvider {...formMethods}>{renderAndCatchError()}</FormProvider>
    );
  }

  return (
    <FillParentAndCenterChildren>
      <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
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
