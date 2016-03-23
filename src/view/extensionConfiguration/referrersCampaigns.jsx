import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { DataElementField } from '@reactor/react-components';

export default class ReferrersCampaigns extends React.Component {
  render() {
    const {
      referrer,
      campaignType,
      campaignValue
    } = this.props.fields;

    return (
      <div>
        <label>
          Referrer
          <Coral.Textfield {...referrer}/>
        </label>
        <label htmlFor="campaignField">Campaign</label>
        <Coral.Select {...campaignType}>
          <Coral.Select.Item value="value">Value</Coral.Select.Item>
          <Coral.Select.Item value="queryParam">Query Param</Coral.Select.Item>
        </Coral.Select>
        <DataElementField id="campaignField" {...campaignValue}
          onOpenSelector={window.extensionBridge.openDataElementSelector}/>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'referrer',
    'campaignType',
    'campaignValue'
  ],
  settingsToFormValues: (values, options) => {
    const { settings } = options;

    values = {
      ...values
    };

    if (settings.hasOwnProperty('campaign')) {
      values.campaignType = settings.campaign.type;
      values.campaignValue = settings.campaign.value;
      delete values.campaign;
    }

    return values;
  },
  formValuesToSettings: (settings, values) => {
    settings = {
      ...settings
    };

    if (values.campaignValue) {
      settings.campaign = {
        type: values.campaignType,
        value: values.campaignValue
      }
    }

    delete settings.campaignType;
    delete settings.campaignValue;

    return settings;
  }
};

