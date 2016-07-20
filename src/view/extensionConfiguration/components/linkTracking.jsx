import React from 'react';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import TagListEditor from './tagListEditor';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];
const DEFAULT_INTERNAL_FILTERS = ['javascript:', 'tel:', 'mailto:'];

export default function LinkTracking({ ...props }) {
  const {
    trackInlineStats,
    trackDownloadLinks,
    linkDownloadFileTypes,
    trackExternalLinks,
    linkExternalFilters,
    linkInternalFilters,
    linkLeaveQueryString
  } = props.fields.trackerProperties;

  return (
    <div>
      <Checkbox
        { ...trackInlineStats }
      >
        Enable ClickMap
      </Checkbox>
      <section className="LinkTracking-section">
        <h4 className="coral-Heading coral-Heading--4">Downloads</h4>
        <Checkbox
          { ...trackDownloadLinks }
        >
          Track download links
        </Checkbox>
        { trackDownloadLinks.checked ?
          <div>
            <TagListEditor
              onChange={ linkDownloadFileTypes.onChange }
              value={ linkDownloadFileTypes.value }
              title="Download Extensions"
              tooltip="Some tooltip"
            />
          </div> : null
        }
      </section>
      <section className="LinkTracking-section u-gapTop">
        <h4 className="coral-Heading coral-Heading--4">Outbound Links</h4>
        <Checkbox
          { ...trackExternalLinks }
        >
          Track outbound links
        </Checkbox>
        { trackExternalLinks.checked ?
          <div>
            <TagListEditor
              onChange={ linkExternalFilters.onChange }
              value={ linkExternalFilters.value }
              title="Track"
              tooltip="Some tooltip"
            />
            <TagListEditor
              onChange={ linkInternalFilters.onChange }
              value={ linkInternalFilters.value }
              title="Never Track"
              tooltip="Some tooltip"
            />
          </div> : null
        }
      </section>
      <Checkbox
        { ...linkLeaveQueryString }
      >
        Keep URL Parameters
      </Checkbox>
    </div>
  );
}

export const formConfig = {
  fields: [
    'trackerProperties.trackInlineStats',
    'trackerProperties.trackDownloadLinks',
    'trackerProperties.linkDownloadFileTypes',
    'trackerProperties.trackExternalLinks',
    'trackerProperties.linkExternalFilters',
    'trackerProperties.linkInternalFilters',
    'trackerProperties.linkLeaveQueryString'
  ],
  settingsToFormValues(values, options) {
    const {
      trackInlineStats,
      trackDownloadLinks,
      linkDownloadFileTypes,
      trackExternalLinks,
      linkExternalFilters,
      linkInternalFilters,
      linkLeaveQueryString
    } = options.settings.trackerProperties || {};

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

