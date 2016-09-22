import React from 'react';
import ReactDOM from 'react-dom';
import bootstrap from './bootstrap';

import './global.styl';

export default (View, formConfig) => {
  ReactDOM.render((
    <div>
      { bootstrap(View, formConfig) }
    </div>
  ), document.getElementById('content'));
};
