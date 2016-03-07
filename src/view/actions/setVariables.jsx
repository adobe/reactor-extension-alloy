import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';

class SetVariables extends React.Component {
  render() {
    return <div>Set Variables</div>;
  }
}

const formConfig = {
  fields: [],
  formValuesToSettings(settings, values) {
    return {
      //browsers: values.browsers || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(SetVariables);

