import { validateYupSchema, yupToFormErrors } from "formik";
import { getValue, setValue } from "./nameUtils";

export default (name, schema) => async values => {
  const value = getValue(values, name);
  try {
    await validateYupSchema(value, schema);
    return {};
  } catch (e) {
    if (e.name === "ValidationError") {
      const errorsInContext = {};
      setValue(errorsInContext, name, yupToFormErrors(e));
      return errorsInContext;
    }
    throw e;
  }
};
