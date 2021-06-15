import { useField } from "formik";
import { useEffect, useContext, useRef } from "react";
import ExtensionViewContext from "../components/extensionViewContext";

export default ({
  getInitialValues,
  getSettings,
  validateFormikState,
  formikStateValidationSchema,
  validateNonFormikState,
  name
}) => {
  const [
    { value: previouslyInitialized },
    ,
    { setValue: setPreviouslyInitialized }
  ] = useField(`${name}Initialized`);

  const {
    registerImperativeForm,
    deregisterImperativeForm,
    initInfo,
    initialized,
    resetForm
  } = useContext(ExtensionViewContext);

  const ref = useRef({});
  ref.current.getInitialValues = getInitialValues;
  ref.current.getSettings = getSettings;
  ref.current.validateFormikState = validateFormikState;
  ref.current.formikStateValidationSchema = formikStateValidationSchema;
  ref.current.validateNonFormikState = validateNonFormikState;
  ref.current.previouslyInitialized = previouslyInitialized;
  ref.current.setPreviouslyInitialized = setPreviouslyInitialized;

  useEffect(() => {
    registerImperativeForm(ref.current);
    return () => {
      deregisterImperativeForm(ref.current);
    };
  }, []);

  return {
    initInfo,
    initialized: initialized && previouslyInitialized,
    resetForm
  };
};
