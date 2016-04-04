import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';
import createFormConfig from '../utils/createFormConfig';
import General from './general';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './libraryManagement';
import Cookies, { formConfig as cookiesFormConfig } from './cookies';
import ReferrersCampaigns, { formConfig as referrersCampaignsFormConfig } from './referrersCampaigns';
import Variables, { formConfig as variablesFormConfig } from './variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './linkTracking';

class ExtensionConfiguration extends React.Component {
  showSuggestions = event => {
    console.log('event', event);
    const autocomplete = event.target;

    autocomplete.addSuggestions([
      {
        value: 'a',
        content: 'A'
      },
      {
        value: 'b',
        content: 'B'
      },
      {
        value: 'c',
        content: 'C'
      },
      {
        value: 'a',
        content: 'A'
      },
      {
        value: 'b',
        content: 'B'
      },
      {
        value: 'c',
        content: 'C'
      },
      {
        value: 'a',
        content: 'A'
      },
      {
        value: 'b',
        content: 'B'
      },
      {
        value: 'c',
        content: 'C'
      },
      {
        value: 'a',
        content: 'A'
      },
      {
        value: 'b',
        content: 'B'
      },
      {
        value: 'c',
        content: 'C'
      }
    ])
  };

  render() {

    return (
      <div>
        <Coral.Autocomplete onShowSuggestions={this.showSuggestions}></Coral.Autocomplete>
        <Coral.Autocomplete>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
          <Coral.Autocomplete.Item>Item 1</Coral.Autocomplete.Item>
        </Coral.Autocomplete>

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
            <Coral.Accordion.Item.Content>
              <LibraryManagement fields={this.props.fields}/>
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
  cookiesFormConfig,
  referrersCampaignsFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig);

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

