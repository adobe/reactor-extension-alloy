import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './libraryManagement';
import General, { formConfig as generalFormConfig } from './general';
import Variables, { formConfig as variablesFormConfig } from './variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './linkTracking';
import Cookies, { formConfig as cookiesFormConfig } from './cookies';
import CustomSetup, { formConfig as customSetupFormConfig } from './customSetup.jsx';

class ExtensionConfiguration extends React.Component {
  render() {
    return (
      <div>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item defaultSelected>
            <Coral.Accordion.Item.Label>Library Management</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <LibraryManagement fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>General</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <General fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Global Variables</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <Variables fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Link Tracking</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <LinkTracking fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Cookies</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <Cookies fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion className="Accordion" variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Customize Page Code</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <CustomSetup fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
      </div>
    );
  }
}

const formConfig = mergeFormConfigs(
  libraryManagementFormConfig,
  generalFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig,
  cookiesFormConfig,
  customSetupFormConfig);

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

