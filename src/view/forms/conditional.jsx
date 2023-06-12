import React from "react";
import { mixed } from "yup";
import { useField } from "formik";
import form from "./form";

/**
 * This function is used to create a form that conditionally renders
 * other form based on a conditional function.
 * @param {array|string} props.args The name of the formik state field or fields
 * that will be passed to the conditional function as arguments.
 * @param {function} props.condition If this function returns true, the part's
 * Components will be rendered, the part's schema will be used, and the part's
 * settings will be returned.
 * @param  {...Form} props.children The form fragments that will be used when
 * the conditional returns true.
 *
 * @returns {Form}
 */
export default function Conditional({ args, condition, children }) {
  const argsArray = Array.isArray(args) ? args : [args];
  const { getInitialValues, getSettings, validationShape, Component } = form({
    children
  });

  return {
    // getInitialValues should run regardless of the condition so that the
    // default formik state can be set up.
    getInitialValues,
    getSettings({ values }) {
      const conditionalArgValues = argsArray.map(arg => values[arg]);
      if (!condition(...conditionalArgValues)) {
        return {};
      }
      return getSettings({ values });
    },
    validationShape: Object.keys(validationShape).reduce((memo, key) => {
      memo[key] = mixed().when(args, {
        is: condition,
        then: () => validationShape[key]
      });
      return memo;
    }, {}),
    Component: props => {
      const conditionalArgValues = argsArray.map(arg => {
        const [{ value }] = useField(arg);
        return value;
      });
      if (!condition(...conditionalArgValues)) {
        return null;
      }
      return <Component {...props} />;
    }
  };
}
