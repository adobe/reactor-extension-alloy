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
import Checkbox from '@react/react-spectrum/Checkbox';
import Heading from '@react/react-spectrum/Heading';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from './wrappedField';
import TagListEditor from './tagListEditor';
import InfoTip from './infoTip';

import './linkTracking.styl';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];

const LinkTracking = ({ trackDownloadLinks, trackExternalLinks }) => (
  <div>
    <WrappedField
      name="trackerProperties.trackInlineStats"
      component={ Checkbox }
    >
      Enable ClickMap
    </WrappedField>

    <section className="LinkTracking-section">
      <Heading size="4">Downloads</Heading>
      <WrappedField
        name="trackerProperties.trackDownloadLinks"
        component={ Checkbox }
      >
        Track download links
      </WrappedField>
      { trackDownloadLinks ?
        <div>
          <WrappedField
            name="trackerProperties.linkDownloadFileTypes"
            component={ TagListEditor }
            title="Download Extensions"
            tooltip="If your site contains links to files with any of these extensions, the URLs of
              these links will appear in the File Downloads report."
          >
            <InfoTip>If your site contains links to files with any of these extensions, the URLs of
              these links will appear in the File Downloads report.</InfoTip>
          </WrappedField>

        </div> : null
      }
    </section>
    <section className="LinkTracking-section u-gapTop">
      <Heading size="4">Outbound Links</Heading>
      <WrappedField
        name="trackerProperties.trackExternalLinks"
        component={ Checkbox }
      >
        Track outbound links
      </WrappedField>
      { trackExternalLinks ?
        <div>
          <WrappedField
            name="trackerProperties.linkExternalFilters"
            component={ TagListEditor }
            title="Track"
            tooltip="Links containing the following filters will be treated as exit links."
          />
          <WrappedField
            name="trackerProperties.linkInternalFilters"
            component={ TagListEditor }
            title="Never Track"
            tooltip="Links defined here will not be treated as exit links."
          />
        </div> : null
      }
    </section>
    <WrappedField
      name="trackerProperties.linkLeaveQueryString"
      component={ Checkbox }
    >
      Keep URL Parameters
    </WrappedField>
  </div>
);

export default connect(
  state => ({
    trackDownloadLinks:
      formValueSelector('default')(state, 'trackerProperties.trackDownloadLinks'),
    trackExternalLinks:
      formValueSelector('default')(state, 'trackerProperties.trackExternalLinks')
  })
)(LinkTracking);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const {
      trackInlineStats,
      trackDownloadLinks,
      linkDownloadFileTypes,
      trackExternalLinks,
      linkExternalFilters,
      linkInternalFilters,
      linkLeaveQueryString
    } = settings.trackerProperties || {};

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        trackInlineStats: trackInlineStats != null ? trackInlineStats : true,
        trackDownloadLinks: trackDownloadLinks != null ? trackDownloadLinks : true,
        linkDownloadFileTypes: linkDownloadFileTypes || DEFAULT_DOWNLOAD_LINKS,
        trackExternalLinks: trackExternalLinks != null ? trackExternalLinks : true,
        linkExternalFilters,
        linkInternalFilters,
        linkLeaveQueryString
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      trackInlineStats,
      trackDownloadLinks,
      linkDownloadFileTypes,
      trackExternalLinks,
      linkExternalFilters,
      linkInternalFilters,
      linkLeaveQueryString
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties,
      trackInlineStats,
      trackDownloadLinks,
      trackExternalLinks,
      linkLeaveQueryString
    };

    if (trackDownloadLinks) {
      trackerProperties.linkDownloadFileTypes = linkDownloadFileTypes;
    }

    if (trackExternalLinks) {
      trackerProperties.linkExternalFilters = linkExternalFilters;
      trackerProperties.linkInternalFilters = linkInternalFilters;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};

