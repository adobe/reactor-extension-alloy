import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reduxForm } from 'redux-form';
import reducer from '../../reduxActions/reducer';

export default (FormComponent, extensionBridge, props = {}) => {
  const store = createStore(reducer, {});

  extensionBridge.register({
    init() {},
    getSettings() {},
    validate() {}
  });

  const ReduxFormComponent = reduxForm({
    form: 'default'
  })(() => (<FormComponent { ...props } />));

  return (
    <Provider store={ store }>
      <ReduxFormComponent />
    </Provider>
  );
};
