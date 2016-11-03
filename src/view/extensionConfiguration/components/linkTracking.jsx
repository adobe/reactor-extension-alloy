import React from 'react';
import Checkbox from '@coralui/redux-form-react-coral/lib/Checkbox';
import Heading from '@coralui/react-coral/lib/Heading';
import { connect } from 'react-redux';
import { formValueSelector, Field } from 'redux-form';

import TagListEditor from './tagListEditor';

import './linkTracking.styl';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];

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
          <Field
            name="trackerProperties.linkDownloadFileTypes"
            component={ TagListEditor }
            title="Download Extensions"
            tooltip="If your site contains links to files with any of these extensions, the URLs of
              these links will appear in the File Downloads report."
          />
        </div> : null
      }
    </section>
    <section className="LinkTracking-section u-gapTop">
      <Heading size="4">Outbound Links</Heading>
      <Field
        name="trackerProperties.trackExternalLinks"
        component={ Checkbox }
      >
        Track outbound links
      </Field>
      { trackExternalLinks ?
        <div>
          <Field
            name="trackerProperties.linkExternalFilters"
            component={ TagListEditor }
            title="Track"
            tooltip="Links defined here will not be treated as exit links."
          />
          <Field
            name="trackerProperties.linkInternalFilters"
            component={ TagListEditor }
            title="Never Track"
            tooltip="Links containing the following filters will be treated as exit links."
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

