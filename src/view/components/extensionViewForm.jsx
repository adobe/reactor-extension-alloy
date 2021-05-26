import React, { useEffect, useContext, useRef } from "react";
import { useFormik, FormikProvider } from "formik";
import PropTypes from "prop-types";
import wrapValidateWithErrorLogging from "../utils/wrapValidateWithErrorLogging";
import ExtensionViewContext from "./extensionViewContext";

const ExtensionViewForm = ({
  initialValues,
  getSettings,
  validate,
  validationSchema,
  render
}) => {
  const formikProps = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => {},
    validate: wrapValidateWithErrorLogging(validate),
    validationSchema,
    validateOnChange: false
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
    const extensionViewFormValidate = () => {
      return formikPropsRef.current.submitForm().then(() => {
        formikPropsRef.current.setSubmitting(false);
        return Object.keys(formikPropsRef.current.errors).length === 0;
      });
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
  validate: PropTypes.func,
  validationSchema: PropTypes.object,
  render: PropTypes.func.isRequired
};

export default ExtensionViewForm;
