import addDataElementToken from './addDataElementToken';

module.exports = field => {
  window.extensionBridge.openDataElementSelector(dataElementName => {
    field.onChange(addDataElementToken(field.value, dataElementName));
  });
};
