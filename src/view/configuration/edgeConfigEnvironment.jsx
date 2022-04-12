import React from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import SandboxSelector from "./sandboxSelector";
import DatastreamSelector from "./datastreamSelector";

const EdgeConfigEnvironment = ({
  name,
  initInfo,
  sandboxMap,
  sandboxes,
  environmentType,
  isRequired
}) => {
  const [{ value: sandboxName }, , { setValue: setSandboxName }] = useField(
    `${name}.sandbox`
  );

  const onSandboxSelectionChange = sandbox => {
    setSandboxName(sandbox.name);
  };

  const selectedSandbox = sandboxMap[sandboxName];

  return (
    <div>
      <SandboxSelector
        name={`${name}.sandbox`}
        defaultSelectedSandbox={selectedSandbox}
        onSelectionChange={onSandboxSelectionChange}
        label={`${environmentType} Environment`}
        items={sandboxes}
        environmentType={environmentType}
        isRequired={isRequired}
      />
      {selectedSandbox && (
        <DatastreamSelector
          name={`${name}.datastreamId`}
          selectedSandbox={selectedSandbox}
          initInfo={initInfo}
          environmentType={environmentType}
          label=" "
        />
      )}
    </div>
  );
};

EdgeConfigEnvironment.propTypes = {
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
  sandboxes: PropTypes.array.isRequired,
  sandboxMap: PropTypes.object.isRequired,
  environmentType: PropTypes.string,
  isRequired: PropTypes.bool
};

export default EdgeConfigEnvironment;
