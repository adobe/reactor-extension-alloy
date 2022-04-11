/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import EdgeConfigEnvironment from "./edgeConfigEnvironment";
import EdgeConfigurationSelectInputMethodOneSandbox from "./edgeConfigurationSelectInputMethodOneSandbox";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";

const prepareSandboxMap = sandboxes => {
  return sandboxes.reduce((acc, sandbox) => {
    acc[sandbox.name] = sandbox;
    return acc;
  }, {});
};

const EdgeConfigurationSelectInputMethod = ({
  name,
  initInfo,
  initialConfigs
}) => {
  const { sandboxes } = initialConfigs;
  const sandboxMap = prepareSandboxMap(sandboxes);

  if (sandboxes.length === 1) {
    return (
      <EdgeConfigurationSelectInputMethodOneSandbox
        initialConfigs={initialConfigs}
        name={name}
      />
    );
  }

  return (
    <>
      <FieldDescriptionAndError description="Choose the sandbox and datastream for this environment.">
        <EdgeConfigEnvironment
          name={`${name}.productionEnvironment`}
          initInfo={initInfo}
          sandboxes={sandboxes}
          sandboxMap={sandboxMap}
          environmentType="Production"
          description=""
          isRequired
        />
      </FieldDescriptionAndError>
      <FieldDescriptionAndError description="Choose the sandbox and datastream for this environment.">
        <EdgeConfigEnvironment
          name={`${name}.stagingEnvironment`}
          initInfo={initInfo}
          sandboxes={sandboxes}
          sandboxMap={sandboxMap}
          environmentType="Staging"
        />
      </FieldDescriptionAndError>
      <FieldDescriptionAndError description="Choose the sandbox and datastream for this environment.">
        <EdgeConfigEnvironment
          name={`${name}.developmentEnvironment`}
          initInfo={initInfo}
          sandboxes={sandboxes}
          sandboxMap={sandboxMap}
          environmentType="Development"
        />
      </FieldDescriptionAndError>
    </>
  );
};

EdgeConfigurationSelectInputMethod.propTypes = {
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
  initialConfigs: PropTypes.object.isRequired
};

export default EdgeConfigurationSelectInputMethod;
