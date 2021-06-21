import PropTypes from "prop-types";
import usePartialForm from "../utils/usePartialForm";

const PartialForm = ({
  getInitialValues,
  getSettings,
  validateFormikState,
  formikStateValidationSchema,
  validateNonFormikState,
  name,
  render
}) => {
  const { initialized, initInfo } = usePartialForm({
    getInitialValues,
    getSettings,
    validateFormikState,
    formikStateValidationSchema,
    validateNonFormikState,
    initializedName: `${name}Initialized`
  });

  if (!initialized) {
    return null;
  }
  return render({ initInfo });
};

PartialForm.propTypes = {
  getInitialValues: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  validateFormikState: PropTypes.func,
  formikStateValidationSchema: PropTypes.object,
  validateNonFormikState: PropTypes.func,
  name: PropTypes.string.isRequired
};

// TODO add prop types validation
export default PartialForm;
