import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Heading from '@coralui/react-coral/lib/Heading';
import { connect } from 'react-redux';
import { formValueSelector, Field } from 'redux-form';

import TagListEditor from './tagListEditor';
import CoralField from '../../components/coralField';

import './linkTracking.styl';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];
const DEFAULT_INTERNAL_FILTERS = ['javascript:', 'tel:', 'mailto:'];

const LinkTracking = ({ trackDownloadLinks, trackExternalLinks }) => (
  <div>
    <CoralField
      name="trackerProperties.trackInlineStats"
      component={ Checkbox }
    >
      Enable ClickMap
    </CoralField>

    <section className="LinkTracking-section">
      <Heading size="4">Downloads</Heading>
      <CoralField
        name="trackerProperties.trackDownloadLinks"
        component={ Checkbox }
      >
        Track download links
      </CoralField>
      { trackDownloadLinks ?
        <div>
          <Field
            name="trackerProperties.linkDownloadFileTypes"
            component={ TagListEditor }
            title="Download Extensions"
            tooltip="Some tooltip"
          />
        </div> : null
      }
    </section>
    <section className="LinkTracking-section u-gapTop">
      <Heading size="4">Outbound Links</Heading>
      <CoralField
        name="trackerProperties.trackExternalLinks"
        component={ Checkbox }
      >
        Track outbound links
      </CoralField>
      { trackExternalLinks ?
        <div>
          <Field
            name="trackerProperties.linkExternalFilters"
            component={ TagListEditor }
            title="Track"
            tooltip="Some tooltip"
          />
          <Field
            name="trackerProperties.linkInternalFilters"
            component={ TagListEditor }
            title="Never Track"
            tooltip="Some tooltip"
          />
        </div> : null
      }
    </section>
    <CoralField
      name="trackerProperties.linkLeaveQueryString"
      component={ Checkbox }
    >
      Keep URL Parameters
    </CoralField>
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

