import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { DataElementSelectorButton } from '@reactor/react-components';
import createDataElementSelectorCallback from '../utils/createDataElementSelectorCallback';

export default class ReferrersCampaigns extends React.Component {
  openSelector = field => {
    window.extensionBridge.openDataElementSelector(createDataElementSelectorCallback(field));
  };

  render() {
    const {
      referrer,
      campaign
    } = this.props.fields.trackerProperties;

    return (
      <div>
        <label>
          <span className="Label">Referrer</span>
          <div>
            <Coral.Textfield className="ReferrersCampaigns-server" {...referrer}/>
            <DataElementSelectorButton onClick={this.openSelector.bind(this, referrer)}/>
          </div>
        </label>

        <label htmlFor="campaignValue">
          <span className="Label">Campaign</span>
        </label>
        <div>
          <Coral.Select className="ReferrersCampaigns-campaignType" {...campaign.type}>
            <Coral.Select.Item value="value">Value</Coral.Select.Item>
            <Coral.Select.Item value="queryParam">Query Param</Coral.Select.Item>
          </Coral.Select>
          <Coral.Textfield
            id="campaignValue"
            className="ReferrersCampaigns-campaignValue u-gapLeft"
            {...campaign.value}/>
          <DataElementSelectorButton onClick={this.openSelector.bind(this, campaign.value)}/>
        </div>
      </div>
    );
  }
}

export const formConfig = createFormConfig({
  fields: [
    'trackerProperties.referrer',
    'trackerProperties.campaign.type',
    'trackerProperties.campaign.value'
  ],
  settingsToFormValues(values, options) {
    const { 
      referrer, 
      campaign 
    } = options.settings.trackerProperties || {};

    let trackerProperties = values.trackerProperties || {};

    trackerProperties = {
      ...trackerProperties
    };

    if (referrer) {
      trackerProperties.referrer = referrer;
    }

    if (campaign) {
      trackerProperties.campaign = {
        type: campaign.type,
        value: campaign.value
      };
    }

    return {
      ...values,
      trackerProperties
    };
  },
  formValuesToSettings(settings, values) {
    const { referrer, campaign } = values.trackerProperties;

    let trackerProperties = settings.trackerProperties || {};

    trackerProperties = {
      ...trackerProperties
    };
    
    if (referrer) {
      trackerProperties.referrer = referrer;
    }

    if (campaign && campaign.value) {
      trackerProperties.campaign = {
        type: campaign.type || 'value',
        value: campaign.value
      }
    }

    return {
      ...settings,
      trackerProperties
    };
  }
});

