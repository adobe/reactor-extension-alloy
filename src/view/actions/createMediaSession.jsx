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
import dataElement from "../forms/dataElement";
import renderForm from "../forms/renderForm";
import codeField from "../forms/codeField";

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    xdm = "",
    playerId = "",
    onBeforeMediaEvent = ""
  } = initInfo.settings || {};

  return {
    instanceName,
    xdm,
    playerId,
    onBeforeMediaEvent
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };
  if (values.xdm) {
    settings.xdm = values.xdm;
  }
  if (values.playerId) {
    settings.playerId = values.playerId;
  }
  if (values.onBeforeMediaEvent) {
    settings.onBeforeMediaEvent = values.onBeforeMediaEvent;
  }

  return settings;
};

const createSessionEventForm = form(
  {
    getInitialValues,
    getSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    textField({
      name: "playerId",
      label: "Player ID",
      description: "Enter your player ID",
      isRequired: true
    }),
    dataElement({
      name: "xdm",
      label: "XDM",
      description: "XDM Object defining the mediaCollection Object.",
      isRequired: true
    }),
    codeField({
      name: "onBeforeMediaEvent",
      label: "On before media event send callback",
      description:
        "Callback function for retrieving the playhead, Quality of Experience Data.",
      placeholder: "// introduce the function code to retrieve the playhead.",
      buttonLabelSuffix: ""
    })
  ]
);

renderForm(createSessionEventForm);
