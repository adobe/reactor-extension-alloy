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
import render from "../render";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import InstanceNamePicker from "../components/instanceNamePicker";

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings ?? {};

  return {
    instanceName,
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName,
  };

  return settings;
};

const SendPushSubscription = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={({ initInfo }) => (
        <FormElementContainer>
          <InstanceNamePicker
            data-test-id="instanceNamePicker"
            name="instanceName"
            initInfo={initInfo}
            disabledDescription="Only one instance was configured for this extension so no configuration is required for this action."
          />
        </FormElementContainer>
      )}
    />
  );
};

render(SendPushSubscription);
