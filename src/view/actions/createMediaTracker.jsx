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

import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import textField from "../forms/textField";
import renderForm from "../forms/renderForm";

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    objectName
  } = initInfo.settings || {};

  return {
    instanceName,
    objectName
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };
  if (values.objectName) {
    settings.objectName = values.objectName;
  }
  return settings;
};

const createMediaTrackerForm = form(
  {
    getInitialValues,
    getSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    textField({
      name: "objectName",
      label: "Export the Media Legacy API to this window object",
      description:
        "Enter the object name where you want the Media API to be exported." +
        " If none is provided by default it is going to be exported to 'window.Media'."
    })
  ]
);

renderForm(createMediaTrackerForm);