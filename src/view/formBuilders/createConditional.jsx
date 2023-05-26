import React from "react";
import { mixed } from "yup";
import { useField } from "formik";
import {
  combineGetSettings,
  combineGetInitialValues,
  combineValidationSchemas,
  combineComponents
} from "./utils";

/**
 * This function is used to create a form builder that conditionally renders
 * other form builders based on a conditional function.
 * @param {array|string} args The name of the formik state field or fields that
 * will be passed to the conditional function as arguments.
 * @param {function} conditional If this function returns true, the part's
 * Components will be rendered, the part's schema will be used, and the part's
 * settings will be returned.
 * @param  {...FormPart} parts The form parts that will be used when the
 * conditional returns true.
 *
 * @returns {FormPart}
 */
export default (args, conditional, ...parts) => {
  const getInitialValues = combineGetInitialValues(parts);
  const getSettings = combineGetSettings(parts);
  const schemaParts = combineValidationSchemas(parts);
  const validationSchema = Object.keys(schemaParts).reduce((memo, key) => {
    memo[key] = mixed().when(args, {
      is: conditional,
      then: () => schemaParts[key]
    });
    return memo;
  }, {});

  const Component = combineComponents(parts);

  return {
    // getInitialValues should run regardless of the condition so that the
    // default formik state can be set up.
    getInitialValues,
    getSettings({ values }) {
      const conditionalArgValues = (Array.isArray(args) ? args : [args]).map(
        arg => values[arg]
      );
      if (!conditional(...conditionalArgValues)) {
        return {};
      }
      return getSettings({ values });
    },
    validationSchema,
    Component: props => {
      const conditionalArgValues = (Array.isArray(args) ? args : [args]).map(
        arg => {
          const [{ value }] = useField(arg);
          return value;
        }
      );
      if (!conditional(...conditionalArgValues)) {
        return null;
      }
      return <Component {...props} />;
    }
  };
};
