/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Radio from '@react/react-spectrum/Radio';
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';
import Heading from '@react/react-spectrum/Heading';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from '../../extensionConfiguration/components/wrappedField';
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
      <Heading size="4">Tracking</Heading>
      <div>
        <WrappedField
          name="type"
          component={ Radio }
          type="radio"
          value={ TYPES.PAGE }
        >
          <span className="u-bold">s.t(): </span>
          Send data to Adobe Analytics and treat it as a page view
        </WrappedField>
      </div>
      <div>
        <WrappedField
          name="type"
          component={ Radio }
          type="radio"
          value={ TYPES.LINK }
        >
          <span className="u-bold">s.tl(): </span>
          Send data to Adobe Analytics and
          <span className="u-italic"> do not </span>
          treat it as a page view
        </WrappedField>
        {
          type === TYPES.LINK ?
            <div className="FieldSubset SendBeacon-linkDetails">
              <div className="SendBeacon-linkType u-gapRight">
                <label>
                  <span className="Label">Link Type</span>
                  <div>
                    <WrappedField
                      name="linkType"
                      component={ Select }
                      className="Field--short"
                      options={ linkTypeOptions }
                    />
                  </div>
                </label>
              </div>
              <div className="SendBeacon-linkName">
                <label>
                  <span className="Label">{ linkNameLabel }</span>
                  <div>
                    <WrappedField
                      name="linkName"
                      component={ Textfield }
                      inputClassName="Field--long"
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

export const formConfig = {
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
};

