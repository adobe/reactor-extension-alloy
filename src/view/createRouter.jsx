/* eslint max-len: [2, 200, 4]*/
import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import ExtensionConfiguration from './extensionConfiguration/extensionConfiguration';
import SetVariables from './actions/setVariables';
import SendBeacon from './actions/sendBeacon';

export default (setFormConfigForCurrentRoute) => {
  const onEnter = nextState => {
    setFormConfigForCurrentRoute(nextState.routes[0].component.formConfig);
  };

  return (
    <Router history={ hashHistory }>
      <Route path="/configuration" component={ ExtensionConfiguration } onEnter={ onEnter } />
      <Route path="/actions/setVariables" component={ SetVariables } onEnter={ onEnter } />
      <Route path="/actions/sendBeacon" component={ SendBeacon } onEnter={ onEnter } />
    </Router>
  );
};
