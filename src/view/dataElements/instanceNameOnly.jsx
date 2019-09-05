/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "regenerator-runtime"; // needed for some of react-spectrum
import React from "react";
import { object, string } from "yup";
import Select from "@react/react-spectrum/Select";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import "./instanceNameOnly.styl";

const getInitialValues = settings => {
  // settings is null if the user is creating a new data element
  if (!settings) {
    settings = {};
  }

  const { instanceName = "" } = settings;

  return {
    instanceName
  };
};

const getSettings = values => {
  return {
    instanceName: values.instanceName
  };
};

const validationSchema = object().shape({
  instanceName: string().required("Please specify an instance")
});

const InstanceNameOnly = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo }) => {
        return (
          <div>
            <label
              htmlFor="instanceNameField"
              className="spectrum-Form-itemLabel"
            >
              Instance
            </label>
            <div>
              <WrappedField
                id="instanceNameField"
                name="instanceName"
                component={Select}
                componentClassName="u-fieldLong"
                options={getInstanceOptions(initInfo)}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

render(InstanceNameOnly);
