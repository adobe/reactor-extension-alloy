import React from "react";
import { object } from "yup";
import ExtensionView from "../components/extensionView";
import {
  combineComponents,
  combineGetInitialValues,
  combineGetSettings,
  combineValidationSchemas
} from "./utils";

/**
 * This creates an extension view React component that can be rendered at the
 * top level of a view
 * @param {...FormPart} parts - The form parts that will be used to build the
 * extension view.
 * @returns {function} - A React function component
 */
export default (...parts) => {
  const getInitialValues = combineGetInitialValues(parts);
  const getSettings = combineGetSettings(parts);
  const validationSchema = object().shape(combineValidationSchemas(parts));
  const Component = combineComponents(parts);

  return () => (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={props => <Component {...props} />}
    />
  );
};
