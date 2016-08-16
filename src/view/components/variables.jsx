import React from 'react';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { DataElementSelectorButton } from '@reactor/react-components';

import mergeFormConfigs from '../utils/mergeFormConfigs';
import openDataElementSelector from '../utils/openDataElementSelector';
import EvarsPropsEditor, { getFormConfig as getEvarsPropsEditorFormConfig } from './evarsPropsEditor';
import EventsEditor, { formConfig as eventsFormConfig } from './eventsEditor';
import HierarchiesEditor, { formConfig as hierarchiesFormConfig } from './hierarchiesEditor';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

const campaignTypeOptions = [{
  label: 'Value',
  value: 'value'
}, {
  label: 'Query Parameter',
  value: 'queryParam'
}];

export default function Variables({ ...props }) {
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
  } = props;

  return (
    <div>
      <span className="Label">eVars</span>
      <EvarsPropsEditor varType="eVar" varTypePlural="eVars" fields={ props.fields } />

      <span className="Label u-gapTop">Props</span>
      <EvarsPropsEditor varType="prop" varTypePlural="props" fields={ props.fields } />

      {
        showEvents ?
          <div>
            <span className="Label u-gapTop">Events</span>
            <EventsEditor fields={ props.fields } />
          </div> : null
      }

      <span className="Label u-gapTop">Hierarchy</span>
      <HierarchiesEditor fields={ props.fields } />

      {
        showDynamicVariablePrefix ?
          <label>
            <span className="Label u-gapTop">Dynamic Variable Prefix</span>
            <div>
              <Textfield
                className="Field--long"
                { ...dynamicVariablePrefix }
              />
              <DataElementSelectorButton
                onClick={ openDataElementSelector.bind(this, dynamicVariablePrefix) }
              />
            </div>
          </label> : null
      }

      <label>
        <span className="Label u-gapTop">Page Name</span>
        <div>
          <Textfield
            className="Field--long"
            { ...pageName }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, pageName) } />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">Page URL</span>
        <div>
          <Textfield
            className="Field--long"
            { ...pageURL }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, pageURL) } />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">Server</span>
        <div>
          <Textfield
            className="Field--long"
            { ...server }
          />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, server) }
          />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">Channel</span>
        <div>
          <Textfield
            className="Field--long"
            { ...channel }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, channel) } />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">Referrer</span>
        <div>
          <Textfield
            className="Field--long"
            { ...referrer }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, referrer) } />
        </div>
      </label>

      <label htmlFor="campaignValue">
        <span className="Label u-gapTop">Campaign</span>
      </label>
      <div>
        <Select
          className="Variables-campaignType"
          options={ campaignTypeOptions }
          { ...campaign.type }
        />
        <Textfield
          id="campaignValue"
          className="Variables-campaignValue u-gapLeft"
          { ...campaign.value }
        />
        <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, campaign.value) } />
      </div>

      <label>
        <span className="Label u-gapTop">Transaction ID</span>
        <div>
          <Textfield
            className="Field--long"
            { ...transactionID }
          />
          <DataElementSelectorButton
            onClick={ openDataElementSelector.bind(this, transactionID) }
          />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">State</span>
        <div>
          <Textfield
            className="Field--long"
            { ...state }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, state) } />
        </div>
      </label>

      <label>
        <span className="Label u-gapTop">Zip</span>
        <div>
          <Textfield
            className="Field--long"
            { ...zip }
          />
          <DataElementSelectorButton onClick={ openDataElementSelector.bind(this, zip) } />
        </div>
      </label>
    </div>
  );
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
