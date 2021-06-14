import { validateYupSchema } from "yup";
import { getValue, setValue } from "./nameUtils";

export default (name, schema) => async (values) => {
  const value = getValue(values, name);
  const errors = await validateYupSchema({ values: value, schema });
  let errorsInContext = {};
  setValue(errorsInContext, name, errors);
  return errorsInContext;
};
