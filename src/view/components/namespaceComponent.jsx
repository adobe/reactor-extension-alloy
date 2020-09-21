import Select from "@react/react-spectrum/Select";
import React from "react";
import Textfield from "@react/react-spectrum/Textfield";
import PropTypes from "prop-types";
import WrappedField from "./wrappedField";

const getSelectedNamespace = (options, namespace) => {
  if (options.length < 1) {
    return undefined;
  }

  if (namespace === "") {
    return "Select an option";
  }

  const found = options.find(
    ({ value }) => value.toUpperCase() === namespace.toUpperCase()
  );

  return found ? found.value : undefined;
};

function NamespaceComponent({ options, name, index, namespace }) {
  const selectedNamespace = getSelectedNamespace(options, namespace);
  return (
    <div>
      {selectedNamespace ? (
        <div>
          <WrappedField
            data-test-id={`namespaceSelect${index}Field`}
            id={`namespace${index}Field`}
            name={name}
            component={Select}
            componentClassName="u-fieldLong"
            options={options}
            value={selectedNamespace}
          />
        </div>
      ) : (
        <div>
          <WrappedField
            name={name}
            data-test-id={`namespace${index}Field`}
            id={`namespace${index}Field`}
            component={Textfield}
            componentClassName="u-fieldLong"
          />
        </div>
      )}
    </div>
  );
}

NamespaceComponent.propTypes = {
  options: PropTypes.array,
  namespace: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string
};

export default NamespaceComponent;
