import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import createFormConfig from '../utils/createFormConfig';
import General, { formConfig as generalFormConfig } from './general';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './libraryManagement';
import Cookies, { formConfig as cookiesFormConfig } from './cookies';
import ReferrersCampaigns, { formConfig as referrersCampaignsFormConfig } from './referrersCampaigns';
import Variables, { formConfig as variablesFormConfig } from './variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './linkTracking';

class ExtensionConfiguration extends React.Component {
  render() {
    return (
      <div>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item defaultSelected>
            <Coral.Accordion.Item.Label>Library Management</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <LibraryManagement fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
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
            <Coral.Accordion.Item.Label>Global Variables</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <Variables fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Link Tracking</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <LinkTracking fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
          </Coral.Accordion.Item>
        </Coral.Accordion>
        <Coral.Accordion variant="quiet">
          <Coral.Accordion.Item>
            <Coral.Accordion.Item.Label>Referrers & Campaigns</Coral.Accordion.Item.Label>
            <Coral.Accordion.Item.Content>
              <ReferrersCampaigns fields={this.props.fields}/>
            </Coral.Accordion.Item.Content>
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

const formConfig = createFormConfig(
  libraryManagementFormConfig,
  generalFormConfig,
  cookiesFormConfig,
  referrersCampaignsFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig);

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

