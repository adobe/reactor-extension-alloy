import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../utils/openDataElementSelector';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from './components/configurationSelector';

const TYPES = {
  PAGE: 'page',
  LINK: 'link'
};

const LINK_TYPES = {
  CUSTOM: 'o',
  DOWNLOAD: 'd',
  EXIT: 'e'
};

export class SendBeacon extends React.Component {
  render() {
    const {
      type,
      linkType,
      linkName
    } = this.props.fields;

    let linkNameLabel;

    switch (linkType.value) {
      case LINK_TYPES.DOWNLOAD:
        linkNameLabel = 'File Name';
        break;
      case LINK_TYPES.EXIT:
        linkNameLabel = 'Destination URL';
        break;
      default:
        linkNameLabel = 'Link Name';
    }

    return (
      <div>
        <ConfigurationSelector className="u-gapBottom" fields={this.props.fields}/>
        <h4 className="coral-Heading coral-Heading--4">Tracking</h4>
        <div>
          <Coral.Radio
            {...type}
            value="page"
            ref="pageViewTypeRadio"
            checked={type.value === TYPES.PAGE}>
            Increment a pageview<span className="SendBeacon-trackerApi"> - s.t()</span>
          </Coral.Radio>
        </div>
        <div>
          <Coral.Radio
            {...type}
            value="link"
            ref="linkTypeRadio"
            checked={type.value === TYPES.LINK}>
            Do not increment a pageview<span className="SendBeacon-trackerApi"> - s.tl()</span>
          </Coral.Radio>
          {
            type.value === TYPES.LINK ?
              <div className="FieldSubset SendBeacon-linkDetails">
                <div className="SendBeacon-linkType u-gapRight">
                  <label>
                    <span className="Label">Link Type</span>
                    <div>
                      <Coral.Select ref="linkTypeSelect" className="Field--short" {...linkType}>
                        <Coral.Select.Item value={LINK_TYPES.CUSTOM}>
                          Custom Link
                        </Coral.Select.Item>
                        <Coral.Select.Item value={LINK_TYPES.DOWNLOAD}>
                          Download Link
                        </Coral.Select.Item>
                        <Coral.Select.Item value={LINK_TYPES.EXIT}>
                          Exit Link
                        </Coral.Select.Item>
                      </Coral.Select>
                    </div>
                  </label>
                </div>
                <div className="SendBeacon-linkName">
                  <label>
                    <span className="Label">{linkNameLabel}</span>
                    <div>
                      <Coral.Textfield
                        ref="linkNameTextfield"
                        className="Field--long"
                        {...linkName}/>
                      <DataElementSelectorButton
                        ref="linkNameButton"
                        onClick={openDataElementSelector.bind(this, linkName)}/>
                    </div>
                  </label>
                </div>
              </div> : null
            }
        </div>
      </div>
    );
  }
}

export const formConfig = mergeFormConfigs(
  configurationSelectorFormConfig, {
    fields: [
      'type',
      'linkType',
      'linkName'
    ],
    settingsToFormValues(values, options) {
      const {
        type,
        linkType,
        linkName
      } = options.settings || {};

      return {
        ...values,
        type: type || TYPES.PAGE,
        linkType: linkType || LINK_TYPES.CUSTOM,
        linkName
      };
    },
    formValuesToSettings(settings, values) {
      const {
        type,
        linkType,
        linkName
      } = values;

      settings = {
        ...settings,
        type
      };

      if (type === TYPES.LINK) {
        settings.linkType = linkType;
        if (linkName) {
          settings.linkName = linkName;
        }
      }

      return settings;
    }
  });

export default extensionViewReduxForm(formConfig)(SendBeacon);

