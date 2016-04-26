import './style.pattern';
import React from 'react';
import ReactDOM from 'react-dom';

import bridgeAdapter from './bridgeAdapter';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reduxActions/reducer';
import createRouter from './createRouter';

window.extensionBridge = window.extensionBridge || {
  register: function() {},
  openDataElementSelector: function() {}
};

const finalCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = finalCreateStore(reducer, {});
const setFormConfigForCurrentRoute = bridgeAdapter(window.extensionBridge, store);
const router = createRouter(setFormConfigForCurrentRoute);

ReactDOM.render((
  <div>
    <Provider store={store}>
      {router}
    </Provider>
  </div>
), document.getElementById('content'));

