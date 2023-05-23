import React from "react";
import { mixed } from "yup";
import { useField } from "formik";
import PropTypes from "prop-types";

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
  const schemaParts = parts.reduce((shape, part) => {
    if (part.validationSchema) {
      Object.assign(shape, part.validationSchema);
    }
    return shape;
  }, {});

  const validationSchema = Object.keys(schemaParts).reduce((memo, key) => {
    memo[key] = mixed().when(args, {
      is: conditional,
      then: () => schemaParts[key]
    });
    return memo;
  }, {});

  const Component = ({ initInfo }) => {
    const conditionalArgValues = (Array.isArray(args) ? args : [args]).map(
      arg => {
        const [{ value }] = useField(arg);
        return value;
      }
    );
    if (!conditional(...conditionalArgValues)) {
      return null;
    }
    return (
      <>
        {parts.map((part, index) => (
          <part.Component initInfo={initInfo} key={index} />
        ))}
      </>
    );
  };
  Component.propTypes = {
    initInfo: PropTypes.object.isRequired
  };

  return {
    getInitialValues({ initInfo }) {
      // getInitialValues should run regardless of the condition so that the
      // default formik state can be set up.
      return parts.reduce((initialValues, part) => {
        if (part.getInitialValues) {
          Object.assign(initialValues, part.getInitialValues({ initInfo }));
        }
        return initialValues;
      }, {});
    },
    getSettings({ values }) {
      const conditionalArgValues = (Array.isArray(args) ? args : [args]).map(
        arg => values[arg]
      );
      if (!conditional(...conditionalArgValues)) {
        return {};
      }
      return parts.reduce((settings, part) => {
        if (part.getSettings) {
          Object.assign(settings, part.getSettings({ values }));
        }
        return settings;
      }, {});
    },
    validationSchema,
    Component
  };
};
