import React from "react";
import PropTypes from "prop-types";
import { Item } from "@adobe/react-spectrum";
import { Picker, TextField } from "./formikReactSpectrum3";

const getSelectedNamespace = (namespaces, selectedNamespaceCode) => {
  if (namespaces.length < 1) {
    return undefined;
  }

  if (selectedNamespaceCode === "") {
    return "Select an option";
  }

  const found = namespaces.find(
    ({ code }) => code.toUpperCase() === selectedNamespaceCode.toUpperCase()
  );

  return found ? found.code : undefined;
};

function NamespaceComponent({
  name,
  index,
  namespaces,
  selectedNamespaceCode
}) {
  const selectedNamespace = getSelectedNamespace(
    namespaces,
    selectedNamespaceCode
  );
  return selectedNamespace ? (
    <Picker
      data-test-id={`namespacePicker${index}Field`}
      label="Namespace"
      name={name}
      items={namespaces}
      width="size-5000"
      isRequired
    >
      {namespace => <Item key={namespace.code}>{namespace.name}</Item>}
    </Picker>
  ) : (
    <TextField
      data-test-id={`namespace${index}Field`}
      label="Namespace"
      name={name}
      width="size-5000"
      isRequired
    />
  );
}

NamespaceComponent.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  namespaces: PropTypes.array,
  selectedNamespaceCode: PropTypes.string
};

export default NamespaceComponent;
