import React from 'react';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import { mergeConfigs } from '../utils/formConfigUtils';
import EvarsPropsEditor, { getFormConfig as getEvarsPropsEditorFormConfig } from './evarsPropsEditor';
import EventsEditor, { formConfig as eventsFormConfig } from './eventsEditor';
import HierarchiesEditor, { formConfig as hierarchiesFormConfig } from './hierarchiesEditor';
import CoralField from './coralField';

import './variables.styl';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

const campaignTypeOptions = [{
  label: 'Value',
  value: 'value'
}, {
  label: 'Query Parameter',
  value: 'queryParam'
}];

export default ({ showDynamicVariablePrefix = true, showEvents = true }) =>
  <div>
    <span className="Label">eVars</span>
    <EvarsPropsEditor varType="eVar" varTypePlural="eVars" />

    <span className="Label u-gapTop">Props</span>
    <EvarsPropsEditor varType="prop" varTypePlural="props" />

    {
      showEvents ?
        <div>
          <span className="Label u-gapTop">Events</span>
          <EventsEditor />
        </div> : null
    }

    <span className="Label u-gapTop">Hierarchy</span>
    <HierarchiesEditor />

    {
      showDynamicVariablePrefix ?
        <label>
          <span className="Label u-gapTop">Dynamic Variable Prefix</span>
          <div>
            <CoralField
              name="trackerProperties.dynamicVariablePrefix"
              component={ Textfield }
              componentClassName="Field--long"
              supportDataElement
            />
          </div>
        </label> : null
    }

    <label>
      <span className="Label u-gapTop">Page Name</span>
      <div>
        <CoralField
          name="trackerProperties.pageName"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">Page URL</span>
      <div>
        <CoralField
          name="trackerProperties.pageURL"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">Server</span>
      <div>
        <CoralField
          name="trackerProperties.server"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">Channel</span>
      <div>
        <CoralField
          name="trackerProperties.channel"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">Referrer</span>
      <div>
        <CoralField
          name="trackerProperties.referrer"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label htmlFor="campaignValue">
      <span className="Label u-gapTop">Campaign</span>
    </label>
    <div>
      <CoralField
        name="trackerProperties.campaign.type"
        component={ Select }
        componentClassName="Variables-campaignType"
        options={ campaignTypeOptions }
      />

      <CoralField
        name="trackerProperties.campaign.value"
        className="u-gapLeft"
        component={ Textfield }
        componentClassName="Variables-campaignValue"
        supportDataElement
      />
    </div>

    <label>
      <span className="Label u-gapTop">Transaction ID</span>
      <div>
        <CoralField
          name="trackerProperties.transactionID"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">State</span>
      <div>
        <CoralField
          name="trackerProperties.state"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>

    <label>
      <span className="Label u-gapTop">Zip</span>
      <div>
        <CoralField
          name="trackerProperties.zip"
          component={ Textfield }
          componentClassName="Field--long"
          supportDataElement
        />
      </div>
    </label>
  </div>;

export const formConfig = mergeConfigs(
  getEvarsPropsEditorFormConfig('eVar', 'eVars'),
  getEvarsPropsEditorFormConfig('prop', 'props'),
  eventsFormConfig,
  hierarchiesFormConfig,
  {
    settingsToFormValues: (values, settings) => {
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
      } = settings.trackerProperties || {};

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
