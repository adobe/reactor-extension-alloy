import React from 'react';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import { Field } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import { mergeConfigs } from '../utils/formConfigUtils';
import EvarsPropsEditor, { getFormConfig as getEvarsPropsEditorFormConfig } from './evarsPropsEditor';
import EventsEditor, { formConfig as eventsFormConfig } from './eventsEditor';
import HierarchiesEditor, { formConfig as hierarchiesFormConfig } from './hierarchiesEditor';
import COMPONENT_NAMES from '../enums/componentNames';

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

    <div className="ColumnGrid">
      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Page Name</span>
        <div>
          <Field
            name="trackerProperties.pageName"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Page URL</span>
        <div>
          <Field
            name="trackerProperties.pageURL"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Server</span>
        <div>
          <Field
            name="trackerProperties.server"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Channel</span>
        <div>
          <Field
            name="trackerProperties.channel"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Referrer</span>
        <div>
          <Field
            name="trackerProperties.referrer"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell" htmlFor="campaignValue">
        <span className="Label u-gapTop">Campaign</span>
        <div>
          <Field
            name="trackerProperties.campaign.type"
            className="Variables-campaignType"
            component={ Select }
            options={ campaignTypeOptions }
          />

          <Field
            name="trackerProperties.campaign.value"
            className="u-gapLeft"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Variables-campaignValue"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">State</span>
        <div>
          <Field
            name="trackerProperties.state"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Zip</span>
        <div>
          <Field
            name="trackerProperties.zip"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Transaction ID</span>
        <div>
          <Field
            name="trackerProperties.transactionID"
            component={ DecoratedInput }
            inputComponent={ Textfield }
            inputClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      {
        showDynamicVariablePrefix ?
          <label className="ColumnGrid-cell">
            <span className="Label u-gapTop">Dynamic Variable Prefix</span>
            <div>
              <Field
                name="trackerProperties.dynamicVariablePrefix"
                component={ DecoratedInput }
                inputComponent={ Textfield }
                inputClassName="Field--long"
                supportDataElement
              />
            </div>
          </label> : null
      }
    </div>
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
    },
    validate(errors) {
      const componentsWithErrors = errors.componentsWithErrors ?
        errors.componentsWithErrors.slice() : [];

      if ([COMPONENT_NAMES.EVARS, COMPONENT_NAMES.PROPS]
          .filter(componentName => componentsWithErrors.indexOf(componentName) !== -1).length) {
        componentsWithErrors.push(COMPONENT_NAMES.VARIABLES);
      }

      return {
        ...errors,
        componentsWithErrors
      };
    }
  }
);
