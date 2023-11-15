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
import { Link } from "@adobe/react-spectrum";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import DataElementSelector from "../components/dataElementSelector";
import render from "../render";
import ExtensionView from "../components/extensionView";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import FormElementContainer from "../components/formElementContainer";
import InstanceNamePicker from "../components/instanceNamePicker";

const getInitialValues = ({ initInfo }) => {
  console.log("init", initInfo);
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    xdm = "",
    playerId = ""
  } = initInfo.settings || {};

  return {
    instanceName,
    xdm,
    playerId
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

  return settings;
};

const validationSchema = object().shape({
  xdm: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
});

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
          </FormElementContainer>
        );
      }}
    />
  );
};

render(CreateMediaSession);
