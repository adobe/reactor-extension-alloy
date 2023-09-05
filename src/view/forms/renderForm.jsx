import React from "react";
import { object } from "yup";
import PropTypes from "prop-types";
import ExtensionView from "../components/extensionView";
import render from "../render";

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
  getInitialValues: PropTypes.func,
  getSettings: PropTypes.func,
  validationSchema: PropTypes.object,
  Component: PropTypes.func
};

export default ({ validationShape, ...formPart }) => {
  formPart.validationSchema = object().shape(validationShape);
  render(() => <FormExtensionView {...formPart} />);
};
