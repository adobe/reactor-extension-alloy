import { useField } from "formik";
import { useEffect, useContext, useRef } from "react";
import ExtensionViewContext from "../components/extensionViewContext";

export default ({
  getInitialValues,
  getSettings,
  validateFormikState,
  formikStateValidationSchema,
  validateNonFormikState,
  initializedName
}) => {
  const [{ value: initialized }] = useField(initializedName);

  const {
    registerPartialForm,
    dropPartialForm,
    initInfo,
    resetForm
  } = useContext(ExtensionViewContext);

  const configRef = useRef({});
  configRef.current.getInitialValues = getInitialValues;
  configRef.current.getSettings = getSettings;
  configRef.current.validateFormikState = validateFormikState;
  configRef.current.formikStateValidationSchema = formikStateValidationSchema;
  configRef.current.validateNonFormikState = validateNonFormikState;
  configRef.current.initialized = initialized;
  configRef.current.initializedName = initializedName;

  useEffect(() => {
    registerPartialForm(configRef.current);
    return () => {
      dropPartialForm(configRef.current);
    };
  }, []);

  return {
    initInfo,
    initialized,
    resetForm
  };
};
