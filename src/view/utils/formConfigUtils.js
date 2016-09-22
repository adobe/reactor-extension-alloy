/* eslint arrow-body-style: 0, no-shadow: 0 */
import deep from 'deep-get-set';
import deepExtend from 'deep-extend';

/**
 * Copies values from one object to a new object if the properties are in the propertyPaths
 * list. Nested object structure is maintained. A property path is a
 * period-delimited string (e.g., a.b.c).
 *
 * @param {Object} obj The object to copy properties from.
 * @param {String[]} propertyPaths A list of property paths that should be copied.
 * @returns {Object}
 */
export const filterObject = (obj = {}, propertyPaths = []) => {
  // If we ever need to support property path wildcards like a.b.* then
  // https://github.com/deoxxa/dotty might work instead of deep-get-set.
  deep.p = true;

  const result = {};

  propertyPaths.forEach(propertyPath => {
    const value = deep(obj, propertyPath);

    if (value !== undefined) {
      deep(result, propertyPath, value);
    }
  });

  return result;
};

/**
 * Sets a value if it is undefined. Property paths are supported. A property path is a
 * period-delimited string (e.g., a.b.c). If any object in the property path does not exist,
 * it will be automatically created.
 *
 * @param {Object} obj Object on which the value should be set.
 * @param {String} path The path to the property.
 * @param {*} value The value that should be set.
 */
export const deepSetIfUndefined = (obj, path, value) => {
  const existingValue = deep(obj, path);

  if (existingValue === undefined) {
    deep.p = true;
    deep(obj, path, value);
  }
};

// If you switch out the module used, make sure it creates deep properties on the destination
// object if they don't exist. (the deep-assign npm module does not)
/**
 * Extends objects recursively.
 */
export const deepAssign = deepExtend;

/**
 * Merges multiple form config objects.
 *
 * @param formConfigs Form config objects
 * @returns {Object}
 */
export const mergeConfigs = (...formConfigs) => ({
  settingsToFormValues(values, settings, meta) {
    return formConfigs.reduce((accValues, formConfig) => {
      return formConfig.settingsToFormValues ?
        formConfig.settingsToFormValues(accValues, settings, meta) :
        accValues;
    }, values);
  },
  formValuesToSettings(settings, values, meta) {
    return formConfigs.reduce((accSettings, formConfig) => {
      return formConfig.formValuesToSettings ?
        formConfig.formValuesToSettings(accSettings, values, meta) :
        accSettings;
    }, settings);
  },
  validate(errors, values, meta) {
    return formConfigs.reduce((accErrors, formConfig) => {
      return formConfig.validate ?
        formConfig.validate(accErrors, values, meta) :
        accErrors;
    }, errors);
  }
});
