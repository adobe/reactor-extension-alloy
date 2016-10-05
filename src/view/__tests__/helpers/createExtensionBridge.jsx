export default () => {
  let registeredOptions;

  return {
    register(options) {
      registeredOptions = options;
    },
    init(...args) {
      return registeredOptions.init.apply(this, args);
    },
    validate(...args) {
      return registeredOptions.validate.apply(this, args);
    },
    getSettings(...args) {
      return registeredOptions.getSettings.apply(this, args);
    },
    openCodeEditor() {},
    openRegexTester() {},
    openDataElementSelector() {}
  };
};
