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

import React from "react";
import { object, string } from "yup";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import comboBox from "../forms/comboBox";
import mediaEventTypes from "./constants/mediaEventTypes";
import conditional from "../forms/conditional";
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

const validationSchema = object().shape({
  xdm: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED),
  playerId: string(),
  onBeforeMediaEvent: string()
});

/*
const CreateMediaSession = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => {
        return (
          <FormElementContainer>
            <InstanceNamePicker
              data-test-id="instanceNameField"
              name="instanceName"
              initInfo={initInfo}
            />
            <DataElementSelector>
              <FormikTextField
                data-test-id="mediaSessionPlayerIDField"
                name="playerId"
                label="Player ID"
                description={
                  "Provide this session with an ID, " +
                  "to be able to track different event types for this media session ID."
                }
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector>
              <FormikTextField
                data-test-id="xdmField"
                name="xdm"
                label="XDM data"
                description={
                  <>
                    Provide a data element which returns an object matching your
                    XDM schema. You may want to use the{" "}
                    <Link>
                      <a
                        href="https://experienceleague.adobe.com/docs/experience-platform/edge/extension/data-element-types.html?lang=en#xdm-object"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        XDM Object
                      </a>
                    </Link>{" "}
                    data element type to build this object. You can also combine
                    objects using the{" "}
                    <Link>
                      <a
                        href="https://experienceleague.adobe.com/docs/experience-platform/tags/extensions/adobe/core/overview.html?lang=en#merged-objects"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Merged Objects
                      </a>
                    </Link>{" "}
                    data element type from the Core extension.
                  </>
                }
                width="size-5000"
              />
            </DataElementSelector>
            <CodeField
              data-test-id="onBeforeMediaEventButton"
              label="On before media event send callback"
              buttonLabelSuffix="on before media event send callback code"
              name="onBeforeMediaEvent"
              description="Callback function for retrieving the playhead, Quality of Experience Data."
              language="javascript"
              placeholder="introduce the function code to retrieve the playhead."
            />
          </FormElementContainer>
        );
      }}
    />
  );
};

render(CreateMediaSession);
*/

const createSessionEventForm = form(
  {
    getInitialValues,
    getSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    comboBox({
      name: "eventType",
      label: "Media Event Type",
      description: "Select your media event type",
      isRequired: true,
      items: Object.keys(mediaEventTypes).reduce((items, key) => {
        items.push({ value: key, label: mediaEventTypes[key] });
        return items;
      }, [])
    }),
    textField({
      name: "playerId",
      label: "Player ID",
      description: "Enter your player ID"
    }),
    dataElement({
      name: "xdm",
      label: "XDM",
      description: "XDM Object defining the mediaCollection Object.",
      isRequired: true
    }),
    conditional(
      {
        args: "playerId",
        condition: playerId => playerId
      },
      [
        codeField({
          name: "onBeforeMediaEvent",
          isRequired: true,
          label: "On before media event send callback",
          description:
            "Callback function for retrieving the playhead, Quality of Experience Data.",
          placeholder:
            "// introduce the function code to retrieve the playhead.",
          buttonLabelSuffix: ""
        })
      ]
    )
  ]
);

renderForm(createSessionEventForm);
