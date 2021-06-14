import useImperativeForm from "../utils/useImperativeForm"

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
    console.log(`${name} not initialized.`);
    return null;
  }
  console.log(`${name} initialized.`);

  return render({ initInfo });
};

export default ImperativeForm;
