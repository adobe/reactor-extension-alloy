import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';

import createFormConfig from '../utils/createFormConfig';
import TagListEditor from './components/tagListEditor';

const DEFAULT_DOWNLOAD_LINKS = ['doc', 'docx', 'eps', 'jpg', 'png', 'svg', 'xls', 'ppt', 'pptx',
  'pdf', 'xlsx', 'tab', 'csv', 'zip', 'txt', 'vsd', 'vxd', 'xml', 'js', 'css', 'rar', 'exe', 'wma',
  'mov', 'avi', 'wmv', 'mp3', 'wav', 'm4v'];
const DEFAULT_INTERNAL_FILTERS = ['javascript:', 'tel:', 'mailto:'];

export default class LinkTracking extends React.Component {
  render() {
    const {
      trackInlineStats,
      trackDownloadLinks,
      linkDownloadFileTypes,
      trackExternalLinks,
      linkExternalFilters,
      linkInternalFilters,
      linkLeaveQueryString
    } = this.props.fields.trackerProperties;

    return (
      <div>
        <Coral.Checkbox
          ref="enableClickMapCheckbox"
          {...trackInlineStats}>
          Enable ClickMap
        </Coral.Checkbox>
        <section className="LinkTracking-section">
          <h4 className="coral-Heading coral-Heading--4">Downloads</h4>
          <Coral.Checkbox
            ref="trackDownloadLinksCheckbox"
            {...trackDownloadLinks}>
            Track download links
          </Coral.Checkbox>
          { trackDownloadLinks.checked ?
            <div>
              <TagListEditor
                onChange={linkDownloadFileTypes.onChange}
                value={linkDownloadFileTypes.value}
                title="Download Extensions"
                tooltip="Some tooltip"/>
            </div> : null
          }
        </section>
        <section className="LinkTracking-section u-gapTop">
          <h4 className="coral-Heading coral-Heading--4">Outbound Links</h4>
          <Coral.Checkbox
            ref="trackOutboundLinksCheckbox"
            {...trackExternalLinks}>
            Track outbound links
          </Coral.Checkbox>
          { trackExternalLinks.checked ?
            <div>
              <TagListEditor
                onChange={linkExternalFilters.onChange}
                value={linkExternalFilters.value}
                title="Track"
                tooltip="Some tooltip"/>
              <TagListEditor
                onChange={linkInternalFilters.onChange}
                value={linkInternalFilters.value}
                title="Never Track"
                tooltip="Some tooltip"/>
            </div> : null
          }
        </section>
        <Coral.Checkbox
          ref="keepUrlParametersCheckbox"
          {...linkLeaveQueryString}>
          Keep URL Parameters
        </Coral.Checkbox>
      </div>
    );
  }
}

export const formConfig = createFormConfig({
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

    let trackerProperties = values.trackerProperties || {};
    
    trackerProperties = {
      ...trackerProperties,
      'trackInlineStats': trackInlineStats != null ? trackInlineStats : true,
      'trackDownloadLinks': trackDownloadLinks != null ? trackDownloadLinks : true,
      'linkDownloadFileTypes': linkDownloadFileTypes || DEFAULT_DOWNLOAD_LINKS,
      'trackExternalLinks': trackExternalLinks != null ? trackExternalLinks : true,
      linkExternalFilters,
      'linkInternalFilters': linkInternalFilters || DEFAULT_INTERNAL_FILTERS,
      linkLeaveQueryString
    };

    return {
      ...values,
      trackerProperties
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
    
    let trackerProperties = settings.trackerProperties || {};

    trackerProperties = {
      ...trackerProperties,
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
});

