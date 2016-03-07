import React from 'react';
import extensionViewReduxForm from '../extensionViewReduxForm';

class ConfigureBeacon extends React.Component {
  render() {
    return <div>Configure Beacon</div>;
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

export default extensionViewReduxForm(formConfig)(ConfigureBeacon);

