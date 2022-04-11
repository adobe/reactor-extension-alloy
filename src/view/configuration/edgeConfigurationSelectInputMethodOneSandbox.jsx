import React from "react";
import PropTypes from "prop-types";
import FormElementContainer from "../components/formElementContainer";
import DatastreamSelector from "./datastreamSelector";
import SandboxSelector from "./sandboxSelector";

const EdgeConfigurationSelectInputMethodOneSandbox = ({
  name,
  initialConfigs
}) => {
  const { datastreams, sandboxes } = initialConfigs;
  const selectedSandbox = sandboxes[0];

  return (
    <FormElementContainer>
      <SandboxSelector
        name={`${name}.productionEnvironment.sandbox`}
        defaultSelectedSandbox={selectedSandbox}
        label="Adobe Experience Platform Sandbox"
        items={sandboxes}
        isDisabled
      />

      <DatastreamSelector
        name={`${name}.productionEnvironment.datastreamId`}
        label="Production Datastream"
        description="Choose the datastream for this environment."
        items={datastreams}
        isRequired
      />
      <SandboxSelector
        name={`${name}.stagingEnvironment.sandbox`}
        defaultSelectedSandbox={selectedSandbox}
        label="Adobe Experience Platform Sandbox"
        items={sandboxes}
        isHidden
      />
      <DatastreamSelector
        name={`${name}.stagingEnvironment.datastreamId`}
        label="Staging Datastream"
        description="Choose the datastream for this environment."
        items={datastreams}
      />
      <SandboxSelector
        name={`${name}.developmentEnvironment.sandbox`}
        defaultSelectedSandbox={selectedSandbox}
        label="Adobe Experience Platform Sandbox"
        items={sandboxes}
        isHidden
      />
      <DatastreamSelector
        name={`${name}.developmentEnvironment.datastreamId`}
        label="Development Datastream"
        description="Choose the datastream for this environment."
        items={datastreams}
      />
    </FormElementContainer>
  );
};

EdgeConfigurationSelectInputMethodOneSandbox.propTypes = {
  name: PropTypes.string.isRequired,
  initialConfigs: PropTypes.object.isRequired
};

export default EdgeConfigurationSelectInputMethodOneSandbox;
