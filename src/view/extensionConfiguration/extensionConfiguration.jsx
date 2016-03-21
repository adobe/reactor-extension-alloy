import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import General from './general';
import Cookies, { formConfig as cookiesFormConfig } from './cookies';

class ExtensionConfiguration extends React.Component {
  render() {
    return (
      <div>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>General</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <General/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Library Management</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>Content.</Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Global Variables</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>Content.</Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Cookies</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <Cookies fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
      </div>
    );
  }
}

const formConfig = {
  fields: cookiesFormConfig.fields,
  settingsToFormValues: cookiesFormConfig.settingsToFormValues,
  formValuesToSettings: cookiesFormConfig.formValuesToSettings,
  validate: cookiesFormConfig.validate
};

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

