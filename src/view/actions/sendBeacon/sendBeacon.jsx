import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Heading from '@coralui/react-coral/lib/Heading';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import CoralField from '../../components/coralField';

import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from '../components/configurationSelector';
import { mergeConfigs } from '../../utils/formConfigUtils';

import './sendBeacon.styl';

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

const SendBeacon = ({ type, linkType }) => {
  let linkNameLabel;

  switch (linkType) {
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
      <ConfigurationSelector className="u-gapBottom" />
      <Heading size="4">Tracking</Heading>
      <div>
        <CoralField
          name="type"
          component={ Radio }
          value={ TYPES.PAGE }
        >
          Increment a pageview<span className="SendBeacon-trackerApi"> - s.t()</span>
        </CoralField>
      </div>
      <div>
        <CoralField
          name="type"
          component={ Radio }
          value={ TYPES.LINK }
        >
          Do not increment a pageview<span className="SendBeacon-trackerApi"> - s.tl()</span>
        </CoralField>
        {
          type === TYPES.LINK ?
            <div className="FieldSubset SendBeacon-linkDetails">
              <div className="SendBeacon-linkType u-gapRight">
                <label>
                  <span className="Label">Link Type</span>
                  <div>
                    <CoralField
                      name="linkType"
                      component={ Select }
                      componentClassName="Field--short"
                      options={ linkTypeOptions }
                    />
                  </div>
                </label>
              </div>
              <div className="SendBeacon-linkName">
                <label>
                  <span className="Label">{ linkNameLabel }</span>
                  <div>
                    <CoralField
                      name="linkName"
                      component={ Textfield }
                      componentClassName="Field--long"
                      supportDataElement
                    />
                  </div>
                </label>
              </div>
            </div> : null
          }
      </div>
    </div>
  );
};

export default connect(
  state => formValueSelector('default')(state, 'type', 'linkType')
)(SendBeacon);

export const formConfig = mergeConfigs(
  configurationSelectorFormConfig,
  {
    settingsToFormValues(values, settings) {
      const {
        type,
        linkType,
        linkName
      } = settings;

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

