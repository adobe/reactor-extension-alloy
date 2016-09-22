import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, compose } from 'redux';
import { reduxForm } from 'redux-form';

import reducer from './reduxActions/reducer';
import bridgeAdapter from './bridgeAdapter';

module.exports = (View, formConfig, extensionBridge = window.extensionBridge) => {
  const finalCreateStore = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, {});

  let handleSubmit;

  class ViewWrapper extends React.Component {
    componentDidUpdate() {
      // Sadly, redux-form provides no other way to access this function.
      handleSubmit = this.props.handleSubmit;
    }

    render() {
      // No need to render until the extension bridge passes initialization information.
      return this.props.initializedByBridge ? <View { ...this.props } /> : null;
    }
  }

  const ReduxView = connect(
    ({ initializedByBridge }) => ({ initializedByBridge })
  )(ViewWrapper);

  const ReduxFormView = reduxForm({
    form: 'default',
    // Proxy the provided validate reducer using a function that matches what redux-form expects.
    // Note that there's no technical reason why config.validate must be a reducer. It does
    // maintain some consistency with settingsToFormValues and formValuesToSettings.
    validate: formConfig.validate ?
      values => formConfig.validate({}, values, store.getState().meta) :
      undefined
  })(ReduxView);

  // We can't pass in handleSubmit directly because it will likely be undefined until
  // the view renders.
  bridgeAdapter(extensionBridge, store, formConfig, cb => handleSubmit(cb));

  return (
    <Provider store={ store }>
      <ReduxFormView />
    </Provider>
  );
};
