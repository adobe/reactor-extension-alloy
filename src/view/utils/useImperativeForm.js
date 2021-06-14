import { useField } from "formik";
import { useEffect, useContext } from "react";
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
    initialized
  } = useContext(ExtensionViewContext);

  useEffect(() => {
    // TODO use the last passed in forms of these functions using a ref
    const imperativeForm = {
      getInitialValues,
      getSettings,
      validateFormikState,
      formikStateValidationSchema,
      validateNonFormikState,
      previouslyInitialized,
      setPreviouslyInitialized
    };

    registerImperativeForm(imperativeForm);
    return () => {
      deregisterImperativeForm(imperativeForm);
    };
  }, []);

  return { initInfo, initialized: initialized && previouslyInitialized };
};
