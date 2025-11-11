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
import deepAssign from "../utils/deepAssign";

const FormExtensionView = ({
  getInitialValues,
  initializeContext,
  getSettings,
  getValidationSchema,
  Component,
}) => {

  const context = useRef({}).current;

  return (
    <ExtensionView
      getInitialValues={async (params) => {
        const values = getInitialValues(params);
        const values2 = await initializeContext({ ...params, values, context });
        const values3 = deepAssign(values, values2);
        console.log("getInitialValues Values", values3);
        console.log("getInitialValues Context", context);
        return values3;
      }}
      getSettings={params => getSettings({ ...params, context })}
      getFormikStateValidationSchema={params => getValidationSchema({ ...params, context })}
      render={(props) => <Component {...props} context={context} />}
    />
  );
};
FormExtensionView.propTypes = {
  getInitialValues: PropTypes.func,
  getContext: PropTypes.func,
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
  formPart.getValidationSchema = ({ initInfo, context }) => {
    console.log("top level getValidationSchema", context);
    const shape = getValidationShape({ initInfo, existingValidationShape: {}, context });
    return object().shape(shape);
  };
  render(() => <FormExtensionView {...formPart} />);
};
