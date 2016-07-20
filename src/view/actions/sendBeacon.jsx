import { DataElementSelectorButton } from '@reactor/react-components';
import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from './components/configurationSelector';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import openDataElementSelector from '../utils/openDataElementSelector';

const TYPES = {
  PAGE: 'page',
  LINK: 'link'
};

const LINK_TYPES = {
  CUSTOM: 'o',
  DOWNLOAD: 'd',
  EXIT: 'e'
};

const linkTypeOptions = [{
  label: 'Custom Link',
  value: LINK_TYPES.CUSTOM
}, {
  label: 'Download Link',
  value: LINK_TYPES.DOWNLOAD
}, {
  label: 'Exit Link',
  value: LINK_TYPES.EXIT
}];

export function SendBeacon({ ...props }) {
  const {
    type,
    linkType,
    linkName
  } = props.fields;

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
      <ConfigurationSelector className="u-gapBottom" fields={ props.fields } />
      <h4 className="coral-Heading coral-Heading--4">Tracking</h4>
      <div>
        <Radio
          { ...type }
          value="page"
          checked={ type.value === TYPES.PAGE }
        >
          Increment a pageview<span className="SendBeacon-trackerApi"> - s.t()</span>
        </Radio>
      </div>
      <div>
        <Radio
          { ...type }
          value="link"
          checked={ type.value === TYPES.LINK }
        >
          Do not increment a pageview<span className="SendBeacon-trackerApi"> - s.tl()</span>
        </Radio>
        {
          type.value === TYPES.LINK ?
            <div className="FieldSubset SendBeacon-linkDetails">
              <div className="SendBeacon-linkType u-gapRight">
                <label>
                  <span className="Label">Link Type</span>
                  <div>
                    <Select
                      className="Field--short"
                      options={ linkTypeOptions }
                      { ...linkType }
                    />
                  </div>
                </label>
              </div>
              <div className="SendBeacon-linkName">
                <label>
                  <span className="Label">{ linkNameLabel }</span>
                  <div>
                    <Textfield
                      className="Field--long"
                      { ...linkName }
                    />
                    <DataElementSelectorButton
                      onClick={ openDataElementSelector.bind(this, linkName) }
                    />
                  </div>
                </label>
              </div>
            </div> : null
          }
      </div>
    </div>
  );
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

