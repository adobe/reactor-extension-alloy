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
import { Link } from "@adobe/react-spectrum";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import InstanceNamePicker from "../components/instanceNamePicker";
import Alert from "../components/alert";
import Overrides, { bridge as overridesBridge } from "../components/overrides";

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  return {
    instanceName,
    ...overridesBridge.getInitialInstanceValues({ instanceSettings: initInfo })
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };

  const { edgeConfigOverrides } = overridesBridge.getInstanceSettings({
    instanceValues: values
  });

  if (edgeConfigOverrides && Object.keys(edgeConfigOverrides).length > 0) {
    settings.edgeConfigOverrides = edgeConfigOverrides;
  }

  return settings;
};

const RedirectWithIdentity = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={({ initInfo }) => (
        <>
          <Alert
            variant="informative"
            title="Redirect with identity"
            width="size-5000"
            marginTop="size-100"
            marginBottom="size-200"
          >
            Use this action to share identities from the current page to other
            domains. This action is designed to be used with a click event type
            and a value comparison condition. See{" "}
            <Link>
              <a
                href="https://experienceleague.adobe.com/docs/experience-platform/edge/identity/id-sharing.html#tags-extension"
                target="_blank"
                rel="noopener noreferrer"
              >
                cross-domain ID sharing
              </a>
            </Link>{" "}
            for more information.
          </Alert>
          <FormElementContainer>
            <InstanceNamePicker
              data-test-id="instanceNamePicker"
              name="instanceName"
              initInfo={initInfo}
              description="Choose the instance with the identity you would like to use on the linked page."
              disabledDescription="Only one instance was configured for this extension so no configuration is required for this action."
            />
          </FormElementContainer>
          <Overrides />
        </>
      )}
    />
  );
};

render(RedirectWithIdentity);
