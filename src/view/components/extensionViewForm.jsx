import React, { useEffect, useContext, useRef } from "react";
import { useFormik, FormikProvider } from "formik";
import wrapValidateWithErrorLogging from "../utils/wrapValidateWithErrorLogging"
import PropTypes from "prop-types";
import ExtensionViewContext from "./extensionViewContext";

const ExtensionViewForm = ({
  initialValues,
  getSettings,
  claimedFields,
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
    settings
  } = useContext(ExtensionViewContext);

  const formikPropsRef = useRef();
  formikPropsRef.current = formikProps;

  const resetForm = (values = {}) => {
    formikPropsRef.current.resetForm({ values });
  };
/*
  // only resetForm when initialValues changes
  // formikProps aleady has the initialValues
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
    } else {
      resetForm(initialValues);
    }
  }, [initialValues]);
*/

  useEffect(() => {
    const extensionViewFormGetSettings = () => {
      console.log("ExtensionViewForm settings", formikPropsRef.current.values);
      return getSettings({ initInfo, values: formikPropsRef.current.values });
    };
    registerGetSettings(extensionViewFormGetSettings, claimedFields);
    const extensionViewFormValidate = () => {
      return formikPropsRef.current.submitForm().then(() => {
        formikPropsRef.current.setSubmitting(false);
        return Object.keys(formikPropsRef.current.errors).length === 0;
      });
    };
    registerValidate(extensionViewFormValidate);

    return () => {
      console.log("Extension View Form cleanup!",claimedFields);
      deregisterGetSettings(extensionViewFormGetSettings);
      deregisterValidate(extensionViewFormValidate);
    };
  }, []);

  const renderParams = {
    formikProps,
    initInfo,
    settings,
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
