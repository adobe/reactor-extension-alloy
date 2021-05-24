import React, { Fragment, useEffect, useContext } from "react";
import { TextField } from "../components/formikReactSpectrum3";
import { object, string } from "yup";
import ExtensionViewForm from "./extensionViewForm";
import ExtensionViewContext from "./extensionViewContext";

const validationSchema = object().shape({
  first: string().required(),
  last: string().required()
});

const Subform1 = ({ name }) => {

  const {
    settings
  } = useContext(ExtensionViewContext);

  const initialValues = { first: "", last: "" };
  if (settings && settings[name]) {
    const i = settings[name].indexOf(" ");
    if (i !== -1) {
      initialValues.first = settings[name].substring(0,i);
      initialValues.last = settings[name].substring(i+1);
    } else {
      initialValues.first = settings[name];
    }
  }

  const getSettings = ({ values }) => {
    return {
      [name]: `${values.first} ${values.last}`
    };
  };

    return (
    <ExtensionViewForm
      initialValues={initialValues}
      getSettings={getSettings}
      claimedFields={[name]}
      validationSchema={validationSchema}
      render={() => {
        return (
          <Fragment>
            <TextField
              name="first"
              label="First Name"
              description="Enter a first name"
              width="size-5000"
            />
            <TextField
              name="last"
              label="Last Name"
              description="Enter a last name"
              width="size-5000"
            />
          </Fragment>
        )
      }}
    />
  );
};

export default Subform1;
