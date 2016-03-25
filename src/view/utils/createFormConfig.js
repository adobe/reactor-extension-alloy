/**
 * Creates a values object that only contains properties pertaining to the specified fields.
 * @private
 * @param {Object} values
 * @param {Array} fields
 * @returns {Object}
 */
const getValueSubset = (values, fields) => {
  const valueSubset = {};

  fields.forEach(field => {
    // Handle the case where field uses array notation (e.g., eVars[].id).
    var firstPathSegment = field.split('.')[0];
    firstPathSegment = firstPathSegment.match(/(.*?)(\[\])?$/)[1];
    if (!valueSubset.hasOwnProperty(firstPathSegment)) {
      valueSubset[firstPathSegment] = values[firstPathSegment];
    }
  });

  return valueSubset;
};

/**
 * Creates a form configuration from one or more options objects.
 * @param {Object[]} formsOptions Array of options objects. Each object typically corresponds to a
 * component class.
 * @param {String[]} formsOptions[].fields Names of fields the component needs. These should follow
 * redux-form semantics.
 * @param {Function} [formsOptions[].settingsToFormValues] A function that takes data being passed to into
 * the extension (which includes previously saved settings) and populates an object with default
 * form values.
 * @param {Function} [formsOptions[].formValuesToSettings] A function that takes current form values and
 * populates a settings object to be saved.
 * @param {Function} [formsOptions[].validate] A function that takes current form values and populates
 * an errors object according to redux-form spec.
 * @returns {*}
 */
module.exports = (...formsOptions) => {
  const fields = formsOptions.reduce((fields, formOptions) => {
    return fields.concat(formOptions.fields);
  }, []);

  return {
    fields,
    settingsToFormValues(values, options) {
      return formsOptions.reduce((values, formOptions) => {
        return formOptions.settingsToFormValues ?
          formOptions.settingsToFormValues(values, options) :
          values;
      }, values);
    },
    formValuesToSettings(settings, values) {
      return formsOptions.reduce((settings, formOptions) => {
        // Only pass the values that pertain to the fields the form requested.
        const valueSubset = getValueSubset(values, formOptions.fields);
        return formOptions.formValuesToSettings ?
          formOptions.formValuesToSettings(settings, valueSubset) :
          settings;
      }, settings);
    },
    validate(errors, values) {
      return formsOptions.reduce((errors, formOptions) => {
        // Only pass the values that pertain to the fields the form requested.
        const valueSubset = getValueSubset(values, formOptions.fields);
        return formOptions.validate ?
          formOptions.validate(errors, valueSubset) :
          errors;
      }, errors);
    }
  }
};
