import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import LinkTracking, { formConfig } from '../linkTracking';
import TagListEditor from '../tagListEditor';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const enableTrackInlineStatsCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackInlineStats')).node;
  const trackDownloadLinksCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackDownloadLinks')).node;
  const trackOutboundLinksCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackExternalLinks')).node;
  const keepUrlParametersCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('linkLeaveQueryString')).node;

  const [
    linkDownloadFileTypesTagListEditor,
    linkExternalFiltersTagListEditor,
    linkInternalFiltersTagListEditor
  ] = wrapper.find(TagListEditor).nodes;

  return {
    enableTrackInlineStatsCheckbox,
    trackDownloadLinksCheckbox,
    trackOutboundLinksCheckbox,
    linkDownloadFileTypesTagListEditor,
    linkExternalFiltersTagListEditor,
    linkInternalFiltersTagListEditor,
    keepUrlParametersCheckbox
  };
};

describe('link tracking', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(LinkTracking, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          trackInlineStats: false,
          trackDownloadLinks: true,
          trackExternalLinks: true,
          linkDownloadFileTypes: ['avi', 'exe'],
          linkInternalFilters: ['tel:', 'mailto:'],
          linkExternalFilters: ['http://someurl.com', 'http://someurl2.com'],
          linkLeaveQueryString: true
        }
      }
    });

    const {
      enableTrackInlineStatsCheckbox,
      trackDownloadLinksCheckbox,
      trackOutboundLinksCheckbox,
      linkDownloadFileTypesTagListEditor,
      linkExternalFiltersTagListEditor,
      linkInternalFiltersTagListEditor,
      keepUrlParametersCheckbox
    } = getReactComponents(instance);

    expect(enableTrackInlineStatsCheckbox.props.value).toBe(false);
    expect(trackDownloadLinksCheckbox.props.value).toBe(true);
    expect(trackOutboundLinksCheckbox.props.value).toBe(true);
    expect(linkDownloadFileTypesTagListEditor.props.input.value).toEqual(['avi', 'exe']);
    expect(linkInternalFiltersTagListEditor.props.input.value).toEqual(['tel:', 'mailto:']);
    expect(linkExternalFiltersTagListEditor.props.input.value)
      .toEqual(['http://someurl.com', 'http://someurl2.com']);
    expect(keepUrlParametersCheckbox.props.value).toBe(true);
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      enableTrackInlineStatsCheckbox,
      trackDownloadLinksCheckbox,
      trackOutboundLinksCheckbox,
      keepUrlParametersCheckbox
    } = getReactComponents(instance);

    enableTrackInlineStatsCheckbox.props.onChange(false);
    trackDownloadLinksCheckbox.props.onChange(true);
    trackOutboundLinksCheckbox.props.onChange(true);
    keepUrlParametersCheckbox.props.onChange(true);

    const {
      linkDownloadFileTypesTagListEditor,
      linkExternalFiltersTagListEditor,
      linkInternalFiltersTagListEditor
    } = getReactComponents(instance);

    linkDownloadFileTypesTagListEditor.props.input.onChange(['avi', 'exe']);
    linkInternalFiltersTagListEditor.props.input.onChange(['tel:', 'mailto:']);
    linkExternalFiltersTagListEditor.props.input.onChange(['http://someurl.com', 'http://someurl2.com']);

    const {
      trackerProperties: {
        trackInlineStats,
        trackDownloadLinks,
        trackExternalLinks,
        linkLeaveQueryString,
        linkDownloadFileTypes,
        linkInternalFilters,
        linkExternalFilters
      }
    } = extensionBridge.getSettings();

    expect(trackInlineStats).toBe(false);
    expect(trackDownloadLinks).toBe(true);
    expect(trackExternalLinks).toBe(true);
    expect(linkDownloadFileTypes).toEqual(['avi', 'exe']);
    expect(linkInternalFilters).toEqual(['tel:', 'mailto:']);
    expect(linkExternalFilters).toEqual(['http://someurl.com', 'http://someurl2.com']);
    expect(linkLeaveQueryString).toBe(true);
  });
});
