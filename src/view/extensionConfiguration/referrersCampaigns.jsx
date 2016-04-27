import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { DataElementSelectorButton } from '@reactor/react-components';

export default class ReferrersCampaigns extends React.Component {
  openSelectorCallback = dataElementName => {
    // Input value might be undefined.
    let inputValue = this.props.fields.campaignValue.value || '';
    inputValue += '%' + dataElementName + '%';

    this.props.fields.campaignValue.onChange(inputValue);
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector(this.openSelectorCallback);
  };

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
        <label htmlFor="campaignValue">Campaign</label>
        <Coral.Select {...campaignType}>
          <Coral.Select.Item value="value">Value</Coral.Select.Item>
          <Coral.Select.Item value="queryParam">Query Param</Coral.Select.Item>
        </Coral.Select>
        <Coral.Textfield id="campaignValue" {...campaignValue}/>
        <DataElementSelectorButton onClick={this.openSelector}/>
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

