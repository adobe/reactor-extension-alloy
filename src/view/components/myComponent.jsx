import React, { useContext } from "react"
import ExtensionViewContext from "./extensionViewContext"
import ExtensionViewForm from "./extensionViewForm"
import { TextField } from "./formikReactSpectrum3";


const MyComponent = ({ name }) => {

  const { settings } = useContext(ExtensionViewContext);
  const {
    [name]: value = ""
  } = settings || {};

  const initialValues = { [name]: value };

  return (
    <ExtensionViewForm
      initialValues={initialValues}
      getSettings={({ values: { [name]: value } }) => ({ [name]: value }) }
      render={(formikProps) => {
        return (
          <TextField
            data-test-id={`${name}Field`}
            name={name}
            width="size-5000"
            label={`My Component (${name})`}
          />
        );
      }}
    />
  );
};

export default MyComponent
