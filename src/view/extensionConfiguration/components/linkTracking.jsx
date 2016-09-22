import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Heading from '@coralui/react-coral/lib/Heading';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import TagListEditor from './tagListEditor';
import Field from '../../components/field';

import './linkTracking.styl';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];
const DEFAULT_INTERNAL_FILTERS = ['javascript:', 'tel:', 'mailto:'];

const LinkTracking = ({ trackDownloadLinks, trackExternalLinks }) => (
  <div>
    <Field
      name="trackerProperties.trackInlineStats"
      component={ Checkbox }
    >
      Enable ClickMap
    </Field>

    <section className="LinkTracking-section">
      <Heading size="4">Downloads</Heading>
      <Field
        name="trackerProperties.trackDownloadLinks"
        component={ Checkbox }
      >
        Track download links
      </Field>
      { trackDownloadLinks ?
        <div>
          <TagListEditor
            name="trackerProperties.linkDownloadFileTypes"
            title="Download Extensions"
            tooltip="Some tooltip"
          />
        </div> : null
      }
    </section>
    <section className="LinkTracking-section u-gapTop">
      <h4 className="coral-Heading coral-Heading--4">Outbound Links</h4>
      <Field
        name="trackerProperties.trackExternalLinks"
        component={ Checkbox }
      >
        Track outbound links
      </Field>
      { trackExternalLinks ?
        <div>
          <TagListEditor
            name="trackerProperties.linkExternalFilters"
            title="Track"
            tooltip="Some tooltip"
          />
          <TagListEditor
            name="trackerProperties.linkInternalFilters"
            title="Never Track"
            tooltip="Some tooltip"
          />
        </div> : null
      }
    </section>
    <Field
      name="trackerProperties.linkLeaveQueryString"
      component={ Checkbox }
    >
      Keep URL Parameters
    </Field>
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
        linkInternalFilters: linkInternalFilters || DEFAULT_INTERNAL_FILTERS,
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

