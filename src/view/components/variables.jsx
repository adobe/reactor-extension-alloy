import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import openDataElementSelector from '../utils/openDataElementSelector';
import { DataElementSelectorButton } from '@reactor/react-components';
import EvarsPropsEditor, { getFormConfig as getEvarsPropsEditorFormConfig } from './evarsPropsEditor';
import EventsEditor, { formConfig as eventsFormConfig } from './eventsEditor';
import HierarchiesEditor, { formConfig as hierarchiesFormConfig } from './hierarchiesEditor';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

export default class Variables extends React.Component {
  render() {
    const {
      showDynamicVariablePrefix = true,
      showEvents = true,
      fields: {
        trackerProperties: {
          dynamicVariablePrefix,
          pageName,
          pageURL,
          server,
          channel,
          referrer,
          campaign,
          transactionID,
          state,
          zip
        }
      }
    } = this.props;

    return (
      <div>
        <span className="Label">eVars</span>
        <EvarsPropsEditor varType="eVar" varTypePlural="eVars" fields={this.props.fields}/>

        <span className="Label u-gapTop">Props</span>
        <EvarsPropsEditor varType="prop" varTypePlural="props" fields={this.props.fields}/>

        {
          showEvents ?
            <div>
              <span className="Label u-gapTop">Events</span>
              <EventsEditor fields={this.props.fields}/>
            </div> : null
        }

        <span className="Label u-gapTop">Hierarchy</span>
        <HierarchiesEditor fields={this.props.fields}/>

        {
          showDynamicVariablePrefix ?
            <label>
              <span className="Label u-gapTop">Dynamic Variable Prefix</span>
              <div>
                <Coral.Textfield
                  className="Field--long"
                  ref="dynamicVariablePrefixTextField"
                  {...dynamicVariablePrefix}/>
                <DataElementSelectorButton
                  onClick={openDataElementSelector.bind(this, dynamicVariablePrefix)}/>
              </div>
            </label> : null
        }

        <label>
          <span className="Label u-gapTop">Page Name</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="pageNameTextField"
              {...pageName}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, pageName)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Page URL</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="pageURLTextField"
              {...pageURL}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, pageURL)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Server</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="serverTextField"
              {...server}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, server)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Channel</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="channelTextField"
              {...channel}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, channel)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Referrer</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="referrerTextField"
              {...referrer}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, referrer)}/>
          </div>
        </label>

        <label htmlFor="campaignValue">
          <span className="Label u-gapTop">Campaign</span>
        </label>
        <div>
          <Coral.Select className="Variables-campaignType"
            ref="campaignSelect"
            {...campaign.type}>
            <Coral.Select.Item value="value">Value</Coral.Select.Item>
            <Coral.Select.Item value="queryParam">Query Param</Coral.Select.Item>
          </Coral.Select>
          <Coral.Textfield
            id="campaignValue"
            className="Variables-campaignValue u-gapLeft"
            ref="campaignTextField"
            {...campaign.value}/>
          <DataElementSelectorButton onClick={openDataElementSelector.bind(this, campaign.value)}/>
        </div>

        <label>
          <span className="Label u-gapTop">Transaction ID</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="transactionIDTextField"
              {...transactionID}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, transactionID)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">State</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="stateTextField"
              {...state}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, state)}/>
          </div>
        </label>

        <label>
          <span className="Label u-gapTop">Zip</span>
          <div>
            <Coral.Textfield
              className="Field--long"
              ref="zipTextField"
              {...zip}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, zip)}/>
          </div>
        </label>
      </div>
    );
  }
}

export const formConfig = mergeFormConfigs(
  getEvarsPropsEditorFormConfig('eVar', 'eVars'),
  getEvarsPropsEditorFormConfig('prop', 'props'),
  eventsFormConfig,
  hierarchiesFormConfig,
  {
    fields: [
      'trackerProperties.dynamicVariablePrefix',
      'trackerProperties.pageName',
      'trackerProperties.pageURL',
      'trackerProperties.server',
      'trackerProperties.channel',
      'trackerProperties.referrer',
      'trackerProperties.campaign.type',
      'trackerProperties.campaign.value',
      'trackerProperties.transactionID',
      'trackerProperties.state',
      'trackerProperties.zip'
    ],
    settingsToFormValues: (values, options) => {
      const {
        dynamicVariablePrefix,
        pageName,
        pageURL,
        server,
        channel,
        referrer,
        campaign,
        transactionID,
        state,
        zip
      } = options.settings.trackerProperties || {};

      return {
        ...values,
        trackerProperties: {
          ...values.trackerProperties,
          dynamicVariablePrefix: dynamicVariablePrefix || DYNAMIC_VARIABLE_PREFIX_DEFAULT,
          pageName,
          pageURL,
          server,
          channel,
          referrer,
          campaign: {
            type: campaign && campaign.type ? campaign.type : 'value',
            value: campaign && campaign.value ? campaign.value : ''
          },
          transactionID,
          state,
          zip
        }
      };
    },
    formValuesToSettings: (settings, values) => {
      const {
        dynamicVariablePrefix,
        pageName,
        pageURL,
        server,
        channel,
        referrer,
        campaign,
        transactionID,
        state,
        zip
      } = values.trackerProperties;

      const trackerProperties = {
        ...settings.trackerProperties
      };

      if (pageName) {
        trackerProperties.pageName = pageName;
      }

      if (pageURL) {
        trackerProperties.pageURL = pageURL;
      }

      if (channel) {
        trackerProperties.channel = channel;
      }

      if (server) {
        trackerProperties.server = server;
      }

      if (dynamicVariablePrefix && dynamicVariablePrefix !== DYNAMIC_VARIABLE_PREFIX_DEFAULT) {
        trackerProperties.dynamicVariablePrefix = dynamicVariablePrefix;
      }

      if (referrer) {
        trackerProperties.referrer = referrer;
      }

      if (campaign && campaign.value) {
        trackerProperties.campaign = {
          type: campaign.type,
          value: campaign.value
        };
      }

      if (transactionID) {
        trackerProperties.transactionID = transactionID;
      }

      if (state) {
        trackerProperties.state = state;
      }

      if (zip) {
        trackerProperties.zip = zip;
      }

      return {
        ...settings,
        trackerProperties
      };
    }
  }
);
