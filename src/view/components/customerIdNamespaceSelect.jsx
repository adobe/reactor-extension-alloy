import React, { useState, useEffect } from "react";
import Select from "@react/react-spectrum/Select";
import PropTypes from "prop-types";
import WrappedField from "./wrappedField";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import getCustomerIdNamespaceOptions from "../utils/getCustomerIdNamespaceOptions";

function cinSelect({ name }) {
  const [namespaceOptions, setNamespaceOptions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const nOptions = await getCustomerIdNamespaceOptions();

      setNamespaceOptions(nOptions);
    }

    fetchData();
  }, []);

  return (
    <WrappedField
      id="namespaceField"
      name={name}
      component={Select}
      componentClassName="u-fieldLong"
      options={namespaceOptions}
    />
  );
}

cinSelect.propTypes = {
  name: PropTypes.string
};

export default cinSelect;
