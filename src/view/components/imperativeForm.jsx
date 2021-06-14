import useImperativeForm from "../utils/useImperativeForm";

const ImperativeForm = ({
  getInitialValues,
  getSettings,
  validateFormikState,
  formikStateValidationSchema,
  validateNonFormikState,
  name,
  render
}) => {
  const { initialized, initInfo } = useImperativeForm({
    getInitialValues,
    getSettings,
    validateFormikState,
    formikStateValidationSchema,
    validateNonFormikState,
    name
  });

  if (!initialized) {
    return null;
  }

  return render({ initInfo });
};

export default ImperativeForm;
