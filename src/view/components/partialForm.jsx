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

// TODO add prop types validation
export default PartialForm;
