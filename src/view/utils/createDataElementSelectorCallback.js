import addDataElementToken from './addDataElementToken';

module.exports = field =>
    dataElementName => field.onChange(addDataElementToken(field.value, dataElementName));
