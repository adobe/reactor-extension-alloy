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
import React, { useRef } from "react";
import { object } from "yup";
import PropTypes from "prop-types";
import ExtensionView from "../components/extensionView";
import render from "../render";

const FormExtensionView = ({
  getInitialValues,
  getSettings,
  getValidationSchema,
  Component,
}) => {

  const context = useRef({}).current;

  return (
    <ExtensionView
      getInitialValues={params => getInitialValues({ ...params, context })}
      getSettings={params => getSettings({ ...params, context })}
      getFormikStateValidationSchema={params => getValidationSchema({ ...params, context })}
      render={(props) => <Component {...props} context={context} />}
    />
  );
};
FormExtensionView.propTypes = {
  getInitialValues: PropTypes.func,
  getSettings: PropTypes.func,
  getValidationSchema: PropTypes.object,
  Component: PropTypes.func,
};

/** @typedef {import("./form").Form} Form */
/**
 * Render a form
 * @param {Form} form - The form to render.
 */
export default ({ getValidationShape, ...formPart }) => {
  formPart.getValidationSchema = ({ initInfo }) => {
    const shape = getValidationShape({ initInfo, existingValidationShape: {} });
    return object().shape(shape);
  };
  render(() => <FormExtensionView {...formPart} />);
};
