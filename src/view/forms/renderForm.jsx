/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
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

/** @typedef {import("./form").Form} Form */
/**
 * Render a form
 * @param {Form} form - The form to render.
 */
export default ({ validationShape, ...formPart }) => {
  formPart.validationSchema = object().shape(validationShape);
  render(() => <FormExtensionView {...formPart} />);
};
