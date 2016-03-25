const getValueSubset = (values, fields) => {
  const valueSubset = {};

  fields.forEach(field => {
    var firstPathSegment = field.split('.')[0];
    firstPathSegment = firstPathSegment.match(/(.*?)(\[\])?$/)[1];
    if (!valueSubset.hasOwnProperty(firstPathSegment)) {
      valueSubset[firstPathSegment] = values[firstPathSegment];
    }
  });

  return valueSubset;
};

module.exports = (...formConfigs) => {
  const fields = formConfigs.reduce((fields, formConfig) => {
    return fields.concat(formConfig.fields);
  }, []);

  return {
    fields,
    settingsToFormValues(values, options) {
      return formConfigs.reduce((values, formConfig) => {
        return formConfig.settingsToFormValues ?
          formConfig.settingsToFormValues(values, options) :
          values;
      }, values);
    },
    formValuesToSettings(settings, values) {
      return formConfigs.reduce((settings, formConfig) => {
        const valueSubset = getValueSubset(values, formConfig.fields);
        return formConfig.formValuesToSettings ?
          formConfig.formValuesToSettings(settings, valueSubset) :
          settings;
      }, settings);
    },
    validate(errors, values) {
      return formConfigs.reduce((errors, formConfig) => {
        const valueSubset = getValueSubset(values, formConfig.fields);
        return formConfig.validate ?
          formConfig.validate(errors, valueSubset) :
          errors;
      }, errors);
    }
  }
};
