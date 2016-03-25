import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
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

export const formConfig = createFormConfig({
  fields: [
    'referrer',
    'campaignType',
    'campaignValue'
  ],
  settingsToFormValues(values, options) {
    const { referrer, campaign } = options.settings;

    values = {
      ...values,
      referrer
    };

    if (campaign) {
      values.campaignType = campaign.type;
      values.campaignValue = campaign.value;
    }

    return values;
  },
  formValuesToSettings(settings, values) {
    const { referrer, campaignType, campaignValue } = values;

    settings = {
      ...settings,
      referrer
    };

    if (campaignValue) {
      settings.campaign = {
        type: campaignType,
        value: campaignValue
      }
    }

    return settings;
  }
});

