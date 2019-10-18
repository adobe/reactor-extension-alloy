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
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import "./instanceNameOnly.styl";

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  return {
    instanceName
  };
};

const getSettings = ({ values }) => {
  return {
    instanceName: values.instanceName
  };
};

const InstanceNameOnly = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={({ initInfo }) => {
        return (
          <div>
            <FieldLabel labelFor="propertyIdField" label="Instance" />
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
