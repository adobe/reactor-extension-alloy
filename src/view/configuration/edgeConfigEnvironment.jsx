import React from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import { Item } from "@adobe/react-spectrum";

import DatastreamSelector from "./datastreamSelector";
import { PRODUCTION } from "./constants/environmentType";
import "./style.styl";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";

const EdgeConfigEnvironment = ({
  name,
  initInfo,
  environmentType,
  context
}) => {
  const [{ value: sandboxName }] = useField(`${name}.sandbox`);
  const { current } = context;
  const { sandboxes, datastreams } = current;

  const defaultSandboxOnly = sandboxes.length === 1;

  const selectedSandbox = sandboxes.find(
    sandbox => sandbox.name === sandboxName
  );

  const description = `Choose the ${
    defaultSandboxOnly ? "" : "sandbox and"
  } datastream for the ${environmentType} environment.`;

  return (
    <>
      <FormikPicker
        isHidden={defaultSandboxOnly && environmentType !== PRODUCTION}
        isDisabled={defaultSandboxOnly && environmentType === PRODUCTION}
        isRequired={environmentType === PRODUCTION}
        label={
          defaultSandboxOnly
            ? "Adobe Experience Platform"
            : `${environmentType} environment`
        }
        data-test-id={`${environmentType}SandboxField`}
        UNSAFE_className="CapitalizedLabel"
        description={selectedSandbox ? "" : description}
        name={`${name}.sandbox`}
        items={sandboxes}
        width="size-5000"
        placeholder="Select a sandbox"
      >
        {item => {
          const region = item.region ? ` (${item.region.toUpperCase()})` : "";
          const label = `${item.type.toUpperCase()} ${item.title}${region}`;
          return <Item key={item.name}>{label}</Item>;
        }}
      </FormikPicker>

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
