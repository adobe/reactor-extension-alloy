import React, { useEffect, useContext, useRef } from "react";
import { useFormik, FormikProvider } from "formik";
import PropTypes from "prop-types";
import { object } from "yup";
import ExtensionViewContext from "./extensionViewContext";
import useReportAsyncError from "../utils/useReportAsyncError";

const ExtensionViewForm = ({ render }) => {
  const reportAsyncError = useReportAsyncError();
  const viewRegistrationRef = useRef();
  const formikPropsRef = useRef();

  formikPropsRef.current = useFormik({
    onSubmit: () => {},
    validate: values => {
      let errors;

      // Formik swallows errors that occur during validation, but we want
      // to handle them in a proper manner.
      try {
        if (viewRegistrationRef.current?.validateFormikState) {
          errors = viewRegistrationRef.current.validateFormikState({ values });
        }
      } catch (error) {
        reportAsyncError(
          new Error("An error occurred while validating the view.")
        );
      }

      return errors;
    },
    validationSchema: () => {
      return (
        viewRegistrationRef.current?.formikStateValidationSchema ?? object()
      );
    }
  });

  const {
    registerGetSettings,
    deregisterGetSettings,
    registerValidate,
    deregisterValidate,
    initInfo
  } = useContext(ExtensionViewContext);

  const validateFormikState = async () => {
    // The view hasn't yet initialized formik with initialValues.
    if (!formikPropsRef.current.values) {
      return false;
    }

    await formikPropsRef.current.submitForm();

    // The docs say that the promise submitForm returns
    // will be rejected if there are errors, but that is not the case.
    // Therefore, after the promise is resolved, we pull formikProps.errors
    // (which were set during submitForm()) to see if the form is valid.
    // https://github.com/jaredpalmer/formik/issues/1580
    formikPropsRef.current.setSubmitting(false);
    return Object.keys(formikPropsRef.current.errors).length === 0;
  };

  const validateNonFormikState = async () => {
    if (!viewRegistrationRef.current) {
      // If the view hasn't registered yet, we don't want to consider
      // it valid.
      return false;
    }

    if (!viewRegistrationRef.current.validateNonFormikState) {
      return true;
    }

    return viewRegistrationRef.current.validateNonFormikState();
  };

  useEffect(() => {
    const extensionViewFormGetSettings = () => {
      if (!viewRegistrationRef.current) {
        return {};
      }

      return viewRegistrationRef.current.getSettings({
        initInfo,
        values: formikPropsRef.current.values
      });
    };
    registerGetSettings(extensionViewFormGetSettings);
    const extensionViewFormValidate = async () => {
      const results = await Promise.all([
        validateFormikState(),
        validateNonFormikState()
      ]);
      return results.every(result => result);
    };
    registerValidate(extensionViewFormValidate);

    return () => {
      deregisterGetSettings(extensionViewFormGetSettings);
      deregisterValidate(extensionViewFormValidate);
    };
  }, []);

  const registerImperativeFormApi = api => {
    viewRegistrationRef.current = viewRegistrationRef.current || {};
    viewRegistrationRef.current.getSettings = api.getSettings;
    viewRegistrationRef.current.validateFormikState = api.validateFormikState;
    viewRegistrationRef.current.formikStateValidationSchema =
      api.formikStateValidationSchema;
    viewRegistrationRef.current.validateNonFormikState =
      api.validateNonFormikState;
  };

  const renderParams = {
    initInfo,
    formikProps: formikPropsRef.current,
    registerImperativeFormApi
  };

  return (
    <FormikProvider value={formikPropsRef.current}>
      {render(renderParams)}
    </FormikProvider>
  );
};

ExtensionViewForm.propTypes = {
  render: PropTypes.func.isRequired
};

export default ExtensionViewForm;
