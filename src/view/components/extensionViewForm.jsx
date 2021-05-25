import React, { useEffect, useContext, useRef } from "react";
import { useFormik, FormikProvider } from "formik";
import PropTypes from "prop-types";
import wrapValidateWithErrorLogging from "../utils/wrapValidateWithErrorLogging";
import ExtensionViewContext from "./extensionViewContext";
import TransientFormContext from "./transientFormContext";

const ExtensionViewForm = ({
  initialValues,
  getSettings,
  claimedFields = [],
  validate,
  validationSchema,
  render
}) => {
  let formikInitialValues = initialValues;
  let transientFormContextRef;
  let firstTime = true;

  const transientFormContext = useContext(TransientFormContext);
  if (transientFormContext) {
    // This extensionViewForm is inside of a TransientFormContext
    transientFormContextRef = useRef();
    if (!transientFormContextRef.current) {
      transientFormContextRef.current = transientFormContext();
    }
    if (transientFormContextRef.current.value) {
      // There is some saved state!
      // Set the initialValues to what was last saved when this form was visible
      formikInitialValues = transientFormContextRef.current.value;
      firstTime = false;
    }
  }

  const formikProps = useFormik({
    initialValues: formikInitialValues,
    enableReinitialize: true,
    onSubmit: () => {},
    validate: wrapValidateWithErrorLogging(validate),
    validationSchema,
    validateOnChange: false,
    validateOnMount: !firstTime
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

  useEffect(() => {
    const extensionViewFormGetSettings = () => {
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
      if (transientFormContextRef) {
        transientFormContextRef.current.value = formikPropsRef.current.values;
      }
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
  claimedFields: PropTypes.array,
  render: PropTypes.func.isRequired
};

export default ExtensionViewForm;
