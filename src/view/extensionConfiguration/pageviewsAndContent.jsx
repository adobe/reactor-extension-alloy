import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import { DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../utils/openDataElementSelector';
import HierarchiesEditor, { formConfig as hierarchiesEditorFormConfig } from './components/hierarchiesEditor';

export default class PageviewsAndContent extends React.Component {
  render() {
    const {
      pageName,
      pageURL,
      channel
    } = this.props.fields.trackerProperties;

    return (
      <div>
        <label>
          <span className="Label">Page Name</span>
          <div>
            <Coral.Textfield
              className="Field--large"
              placeholder="Name"
              {...pageName}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, pageName)}/>
          </div>
        </label>
        <label>
          <span className="Label u-gapTop">Page URL</span>
          <div>
            <Coral.Textfield
              className="Field--large"
              placeholder="Page URL"
              {...pageURL}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, pageURL)}/>
          </div>
        </label>
        <label>
          <span className="Label u-gapTop">Channel</span>
          <div>
            <Coral.Textfield
              className="Field--large"
              placeholder="Channel"
              {...channel}/>
            <DataElementSelectorButton onClick={openDataElementSelector.bind(this, channel)}/>
          </div>
        </label>

        <h4 className="coral-Heading coral-Heading--4 u-gapTop">Hierarchy</h4>
        <HierarchiesEditor fields={this.props.fields}/>
      </div>
    );
  }
}

export const formConfig = mergeFormConfigs(
  hierarchiesEditorFormConfig,
  {
    fields: [
      'trackerProperties.pageName',
      'trackerProperties.pageURL',
      'trackerProperties.channel'
    ],
    settingsToFormValues(values, options) {
      let {
        pageName,
        pageURL,
        channel
      } = options.settings.trackerProperties || {};

      return {
        ...values,
        trackerProperties: {
          ...values.trackerProperties,
          pageName,
          pageURL,
          channel
        }
      };
    },
    formValuesToSettings(settings, values) {
      let {
        pageName,
        pageURL,
        channel
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

      return {
        ...settings,
        trackerProperties
      };
    }
  });

