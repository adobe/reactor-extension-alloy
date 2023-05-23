import React from "react";
import { object } from "yup";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";

/**
 * This creates an extension view React component that can be rendered at the
 * top level of a view
 * @param {...FormPart} parts - The form parts that will be used to build the
 * extension view.
 * @returns {function} - A React function component
 */
export default (...parts) => {
  const getInitialValues = ({ initInfo }) => {
    return parts.reduce((initialValues, part) => {
      if (part.getInitialValues) {
        Object.assign(initialValues, part.getInitialValues({ initInfo }));
      }
      return initialValues;
    }, {});
  };

  const getSettings = ({ values }) => {
    return parts.reduce((settings, part) => {
      if (part.getSettings) {
        Object.assign(settings, part.getSettings({ values }));
      }
      return settings;
    }, {});
  };

  const validationSchema = object().shape(
    parts.reduce((shape, part) => {
      if (part.validationSchema) {
        Object.assign(shape, part.validationSchema);
      }
      return shape;
    }, {})
  );

  return () => (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => (
        <FormElementContainer>
          {parts.map((part, index) => (
            <part.Component initInfo={initInfo} key={index} />
          ))}
        </FormElementContainer>
      )}
    />
  );
};
