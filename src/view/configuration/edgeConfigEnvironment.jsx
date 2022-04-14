import React from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import SandboxSelector from "./sandboxSelector";
import DatastreamSelector from "./datastreamSelector";
import { PRODUCTION } from "./constants/environmentType";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";
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
  context,
  isRequired
}) => {
  const [{ value: sandboxName }, , { setValue: setSandboxName }] = useField(
    `${name}.sandbox`
  );
  const { current } = context;
  const { sandboxes, datastreams } = current;

  const sandboxMap = prepareSandboxMap(sandboxes);

  const defaultSandboxOnly = sandboxes.length === 1;

  const selectedSandbox = sandboxMap[sandboxName];

  const isSandboxHidden = defaultSandboxOnly && environmentType !== PRODUCTION;

  const isSandboxDisabled =
    defaultSandboxOnly && environmentType === PRODUCTION;

  const datastreamLabel = defaultSandboxOnly
    ? `${environmentType} datastream`
    : " ";

  const sandboxLabel = defaultSandboxOnly
    ? "Adobe Experience Platform sandbox"
    : `${environmentType} environment`;

  const descriptionAndErrorMessage = `Choose the ${
    defaultSandboxOnly ? "" : "sandbox and"
  } datastream for the ${environmentType} environment.`;

  const sandboxProps = {
    isHidden: isSandboxHidden,
    isDisabled: isSandboxDisabled,
    isRequired,
    label: sandboxLabel,
    "data-test-id": `${environmentType}SandboxField`,
    UNSAFE_className: "CapitalizedLabel"
  };
  const datastreamProps = {
    isRequired: defaultSandboxOnly ? isRequired : false,
    label: datastreamLabel,
    "data-test-id": `${environmentType}DatastreamField`,
    UNSAFE_className: "CapitalizedLabel"
  };

  const onSandboxSelectionChange = sandbox => {
    setSandboxName(sandbox.name);
  };

  return (
    <FieldDescriptionAndError description={descriptionAndErrorMessage}>
      <>
        <SandboxSelector
          name={`${name}.sandbox`}
          defaultSelectedSandbox={selectedSandbox}
          onSelectionChange={onSandboxSelectionChange}
          items={sandboxes}
          otherProps={sandboxProps}
        />
        {selectedSandbox && (
          <DatastreamSelector
            name={`${name}.datastreamId`}
            selectedSandbox={selectedSandbox}
            initInfo={initInfo}
            otherProps={datastreamProps}
            items={datastreams}
          />
        )}
      </>
    </FieldDescriptionAndError>
  );
};

EdgeConfigEnvironment.propTypes = {
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
  environmentType: PropTypes.string,
  isRequired: PropTypes.bool,
  context: PropTypes.object.isRequired
};

export default EdgeConfigEnvironment;
