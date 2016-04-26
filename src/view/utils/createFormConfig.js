/**
 * Copies only certain properties from one object to a new object and returns the new object.
 * @private
 * @param {Object} src
 * @param {Array} propNames
 * @returns {Object}
 */
const getObjectSubset = (src, propNames) => {
  var dest = {};

  propNames.forEach(propName => {
    dest[propName] = src[propName];
  });

  return dest;
};

/**
 * Get relevant value property names based on the redux-form fields a form requests.
 * @param {string[]} fields
 * @returns {string[]}
 */
const getRelevantValueNames = fields => {
  return fields.reduce((relevantValueNames, field) => {
    // Handle the case where field uses array notation (e.g., eVars[].id).
    let valueName = field.split('.')[0];
    valueName = valueName.match(/(.*?)(\[\])?$/)[1];

    if (relevantValueNames.indexOf(valueName) === -1) {
      relevantValueNames.push(valueName);
    }

    return relevantValueNames;
  }, []);
};

/**
 * Creates a form configuration from one or more options objects.
 * @param {Object[]} formsOptions Array of options objects. Each object typically corresponds to a
 * component class.
 * @param {string[]} formsOptions[].fields Names of fields the component needs. These should follow
 * redux-form semantics.
 * @param {Function} [formsOptions[].settingsToFormValues] A function that takes data being passed
 * to into the extension (which includes previously saved settings) and populates an object with
 * default form values.
 * @param {Function} [formsOptions[].formValuesToSettings] A function that takes current form values
 * and populates a settings object to be saved.
 * @param {Function} [formsOptions[].validate] A function that takes current form values and
 * populates an errors object according to redux-form spec.
 * @returns {*}
 */
module.exports = (...formsOptions) => {
  let fields = [];

  /**
   * An array of arrays where each sub-array contains a list of value names pertaining to a form.
   * @type {Array}
   */
  const relevantValueNamesByFormIndex = [];

  formsOptions.forEach(formOptions => {
    fields = fields.concat(formOptions.fields);
    relevantValueNamesByFormIndex.push(getRelevantValueNames(formOptions.fields));
  });

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
      return formsOptions.reduce((settings, formOptions, index) => {
        if (formOptions.formValuesToSettings) {
          // Only pass the values that pertain to the fields the form requested.
          const valuesSubset = getObjectSubset(values, relevantValueNamesByFormIndex[index]);
          return formOptions.formValuesToSettings(settings, valuesSubset);
        }

        return settings;
      }, settings);
    },
    validate(errors, values) {
      return formsOptions.reduce((errors, formOptions, index) => {
        if (formOptions.validate) {
          // Only pass the values that pertain to the fields the form requested.
          const valueSubset = getObjectSubset(values, relevantValueNamesByFormIndex[index]);
          return formOptions.validate(errors, valueSubset);
        }

        return errors;
      }, errors);
    }
  }
};
