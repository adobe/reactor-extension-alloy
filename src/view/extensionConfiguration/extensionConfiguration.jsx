import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';

class ExtensionConfiguration extends React.Component {
  render() {
    return <div>Configuration</div>;
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

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

