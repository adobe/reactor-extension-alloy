/**
 * @typedef {Object} FormPart
 * @property {Function} getInitialValues - A function that converts the Adobe
 * Tags settings to an object of initial values to include in the Formik state.
 * @property {Function} getSettings - A function that converts the Formik state
 * into an object of Adobe Tags settings.
 * @property {Object} validationSchema - An object containing Formik fields as
 * keys and Yup validation schemas as values.
 * @property {Function} Component - The react component to render. This
 * component will be passes the prop "keyPrefix."
 */
