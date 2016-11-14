import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, compose } from 'redux';
import { reduxForm } from 'redux-form';

import reducer from './reduxActions/reducer';
import bridgeAdapter from './bridgeAdapter';

module.exports = (View, formConfig, extensionBridge = window.extensionBridge, props) => {
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
      const { error } = this.props;

      // No need to render until the extension bridge passes initialization information.
      return this.props.initializedByBridge ?
        <View componentsWithErrors={ error } { ...this.props } { ...props } /> :
        null;
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
      (values) => {
        const errors = formConfig.validate({}, values, store.getState().meta);

        return {
          ...errors,
          // A general form-wide error can be returned via the special _error key.
          // From: http://redux-form.com/6.0.5/examples/submitValidation/
          _error: errors.componentsWithErrors
        };
      } :
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
