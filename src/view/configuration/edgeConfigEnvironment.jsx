import React from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import SandboxSelector from "../components/sandboxSelector";
import DatastreamSelector from "./datastreamSelector";
import { PRODUCTION } from "./constants/environmentType";
import "./style.styl";

const prepareSandboxMap = sandboxes => {
  return sandboxes.reduce((acc, sandbox) => {
    acc[sandbox.name] = sandbox;
    return acc;
  }, {});
};

const EdgeConfigEnvironment = ({
  name,
  initInfo,
  environmentType,
  context
}) => {
  const [
    { value: sandboxName },
    { touched, error },
    { setValue: setSandboxName, setTouched }
  ] = useField(`${name}.sandbox`);
  const { current } = context;
  const { sandboxes, datastreams } = current;

  const sandboxMap = prepareSandboxMap(sandboxes);

  const defaultSandboxOnly = sandboxes.length === 1;

  const selectedSandbox = sandboxMap[sandboxName];

  const isSandboxHidden = defaultSandboxOnly && environmentType !== PRODUCTION;

  const isSandboxDisabled =
    defaultSandboxOnly && environmentType === PRODUCTION;

  const sandboxLabel = defaultSandboxOnly
    ? "Adobe Experience Platform sandbox"
    : `${environmentType} environment`;

  const description = `Choose the ${
    defaultSandboxOnly ? "" : "sandbox and"
  } datastream for the ${environmentType} environment.`;

  const sandboxProps = {
    isHidden: isSandboxHidden,
    isRequired: environmentType === PRODUCTION,
    label: sandboxLabel,
    "data-test-id": `${environmentType}SandboxField`,
    UNSAFE_className: "CapitalizedLabel",
    description: selectedSandbox ? "" : description,
    validationState: touched && error ? "invalid" : undefined,
    errorMessage: error,
    onBlur: () => {
      setTouched(true);
    }
  };

  const onSandboxSelectionChange = sandbox => {
    setSandboxName(sandbox.name);
  };

  return (
    <>
      <SandboxSelector
        defaultSelectedSandbox={selectedSandbox}
        onSelectionChange={onSandboxSelectionChange}
        sandboxes={sandboxes}
        sandboxProps={sandboxProps}
        isSandboxDisabled={isSandboxDisabled}
      />
      {selectedSandbox && (
        <DatastreamSelector
          name={`${name}.datastreamId`}
          selectedSandbox={selectedSandbox}
          initInfo={initInfo}
          items={datastreams}
          environmentType={environmentType}
          defaultSandboxOnly={defaultSandboxOnly}
          description={description}
        />
      )}
    </>
  );
};

EdgeConfigEnvironment.propTypes = {
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
  environmentType: PropTypes.string,
  context: PropTypes.object.isRequired
};

export default EdgeConfigEnvironment;
