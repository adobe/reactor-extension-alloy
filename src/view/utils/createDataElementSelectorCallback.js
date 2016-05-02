import addDataElementToken from './addDataElementToken';

module.exports = field => {
  return dataElementName => field.onChange(addDataElementToken(field.value, dataElementName));
};
