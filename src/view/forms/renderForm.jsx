import React from "react";
import { object } from "yup";
import PropTypes from "prop-types";
import ExtensionView from "../components/extensionView";
import render from "../render";

const convertToFormPart = element => {
  const {
    type,
    props: { children, ...props } = {},
    _source: { fileName, lineNumber }
  } = element;
  if (typeof type !== "function") {
    throw new Error(`Unresolved type ${type} at ${fileName}:${lineNumber}`);
  }
  const parts =
    children &&
    (Array.isArray(children) ? children : [children]).map(convertToFormPart);
  return type({ ...props, children: parts });
};

const FormExtensionView = ({
  getInitialValues,
  getSettings,
  validationSchema,
  Component
}) => (
  <ExtensionView
    getInitialValues={getInitialValues}
    getSettings={getSettings}
    formikStateValidationSchema={validationSchema}
    render={props => <Component {...props} />}
  />
);
FormExtensionView.propTypes = {
  getInitialValues: PropTypes.function,
  getSettings: PropTypes.function,
  validationSchema: PropTypes.object,
  Component: PropTypes.function
};

export default element => {
  const formPart = convertToFormPart(element);
  formPart.validationSchema = object().shape(formPart.validationShape);
  render(() => <FormExtensionView {...formPart} />);
};
