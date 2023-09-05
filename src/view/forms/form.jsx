import React from "react";
import FormElementContainer from "../components/formElementContainer";

/**
 * @typedef {Object} Form
 * @property {Function} getInitialValues - A function that converts the Adobe
 * Tags settings to an object of initial values to include in the Formik state.
 * @property {Function} getSettings - A function that converts the Formik state
 * into an object of Adobe Tags settings.
 * @property {Object} validationShape - An object containing Formik fields as
 * keys and Yup validation schemas as values.
 * @property {Function} Component - The react component to render. This
 * component will be passes the props "namePrefix", "initInfo", and
 * "formikProps".
 */

const Identity = x => x;

/**
 * This creates a composite form.
 * @param {Object} [options] - The options for the form.
 * @param {Function} [options.wrapGetInitialValues] - A function that is given
 * the computed initial values from the children form elements and returns the
 * new initial values.
 * @param {Function} [options.wrapGetSettings] - A function that is given the computed
 * settings from the children form elements and returns the new settings.
 * @param {Function} [options.wrapValidationShape] - A function that is given the computed
 * validation shape from the children form elements and returns the new validation
 * shape.
 * @param {Form[]} children - The children forms to combine.
 * @returns {Form}
 */
export default function Form({
  wrapGetInitialValues = Identity,
  wrapGetSettings = Identity,
  wrapValidationShape = Identity
} = {}, children = []) {
  const part = {
    getInitialValues({ initInfo }) {
      const initialValues = children
        .filter(child => child.getInitialValues)
        .reduce((values, child) => {
          return {
            ...values,
            ...child.getInitialValues({ initInfo })
          };
        }, {});
      console.log("InitialValues", initialValues);
      return initialValues;
    },
    getSettings({ values }) {
      return children
        .filter(child => child.getSettings)
        .reduce((settings, child) => {
          return {
            ...settings,
            ...child.getSettings({ values })
          };
        }, {});
    },
    validationShape: children
      .filter(child => child.validationShape)
      .reduce((shape, child) => {
        return {
          ...shape,
          ...child.validationShape
        };
      }, {}),
    Component(props) {
      return (
        <FormElementContainer>
          {children.map(({ Component }, index) => {
            if (Component) {
              return <Component key={`${index}`} {...props} />;
            }
            return null;
          })}
        </FormElementContainer>
      );
    }
  };
  part.getInitialValues = wrapGetInitialValues(part.getInitialValues);
  part.getSettings = wrapGetSettings(part.getSettings);
  part.validationShape = wrapValidationShape(part.validationShape);
  return part;
}
