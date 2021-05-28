import React, { useEffect, useContext, useRef } from "react";
import { useFormik, FormikProvider } from "formik";
import PropTypes from "prop-types";
import wrapValidateWithErrorLogging from "../utils/wrapValidateWithErrorLogging";
import ExtensionViewContext from "./extensionViewContext";

const ExtensionViewForm = ({
  initialValues,
  getSettings,
  validateFormikState,
  formikStateValidationSchema,
  validateNonFormikState,
  render
}) => {
  const formikProps = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {},
    validate: validateFormikState
      ? wrapValidateWithErrorLogging(values => {
          return validateFormikState({ values });
        })
      : undefined,
    validationSchema: formikStateValidationSchema
  });

  const {
    registerGetSettings,
    deregisterGetSettings,
    registerValidate,
    deregisterValidate,
    initInfo,
    initCalls
  } = useContext(ExtensionViewContext);

  const formikPropsRef = useRef();
  formikPropsRef.current = formikProps;

  const resetForm = (values = {}) => {
    formikPropsRef.current.resetForm({ values });
  };

  // Reset the form when the extension bridge calls "init"
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      resetForm(initialValues);
    }
  }, [initCalls]);

  useEffect(() => {
    const extensionViewFormGetSettings = () => {
      return getSettings({ initInfo, values: formikPropsRef.current.values });
    };
    registerGetSettings(extensionViewFormGetSettings);
    const extensionViewFormValidate = async () => {
      const validateFormikStatePromise = formikPropsRef.current
        .submitForm()
        .then(() => {
          // The docs say that the promise submitForm returns
          // will be rejected if there are errors, but that is not the case.
          // Therefore, after the promise is resolved, we pull formikProps.errors
          // (which were set during submitForm()) to see if the form is valid.
          // https://github.com/jaredpalmer/formik/issues/1580
          formikPropsRef.current.setSubmitting(false);
          return Object.keys(formikPropsRef.current.errors).length === 0;
        });
      const validateNonFormikStatePromise = Promise.resolve(
        !validateNonFormikState || validateNonFormikState()
      );
      const results = await Promise.all([
        validateFormikStatePromise,
        validateNonFormikStatePromise
      ]);
      return results.every(result => result);
    };
    registerValidate(extensionViewFormValidate);

    return () => {
      deregisterGetSettings(extensionViewFormGetSettings);
      deregisterValidate(extensionViewFormValidate);
    };
  }, []);

  const renderParams = {
    formikProps,
    initInfo,
    resetForm
  };
  return (
    <FormikProvider value={formikProps}>{render(renderParams)}</FormikProvider>
  );
};

ExtensionViewForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  getSettings: PropTypes.func.isRequired,
  validateFormikState: PropTypes.func,
  formikStateValidationSchema: PropTypes.object,
  validateNonFormikState: PropTypes.func,
  render: PropTypes.func.isRequired
};

export default ExtensionViewForm;
