import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducer from '../../reduxActions/reducer';
import bridgeAdapter from '../../bridgeAdapter';

export const createExtensionBridge = () => {
  let registeredOptions;

  return {
    register(options) {
      registeredOptions = options;
    },
    init() {
      return registeredOptions.init.apply(this, arguments);
    },
    validate() {
      return registeredOptions.validate.apply(this, arguments);
    },
    getSettings() {
      return registeredOptions.getSettings.apply(this, arguments);
    },
    openCodeEditor() {},
    openRegexTester() {},
    openDataElementSelector() {}
  };
};

export const getFormComponent = (FormComponent, extensionBridge, props = {}) => {
  const store = createStore(reducer, {});
  const setFormConfigForCurrentRoute = bridgeAdapter(extensionBridge, store);

  setFormConfigForCurrentRoute(FormComponent.formConfig);

  return (
    <Provider store={store}>
      <FormComponent {...props} />
    </Provider>
  );
};
