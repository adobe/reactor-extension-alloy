import React from "react";
import { TextField } from "../components/formikReactSpectrum3";
import Subform from "../components/subform";
import { object } from "yup";

const getInitialValues = ({ initInfo }) => {
  return new Promise(resolve => setTimeout(() => {
    resolve(initInfo.settings || { field2: "foo" });
  },3000));
};
const getSettings = ({ values }) => {
  return {
    field2: `[${values.field2}]`
  };
};
const validationSchema = object();

const Subform1 = ({ render }) => {



  return (
    <Subform
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={() => {
        return (
          <TextField
            name="field2"
            label="Field 2"
            description="Fill in the awesome field 2"
            width="size-5000"
          />
        );
      }}
    />
  );
};

export default Subform1;
