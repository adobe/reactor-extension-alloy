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
