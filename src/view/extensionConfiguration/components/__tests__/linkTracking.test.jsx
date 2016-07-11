import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import LinkTracking, { formConfig } from '../linkTracking';
import TagListEditor from '../tagListEditor';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const enableTrackInlineStatsCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackInlineStats')).node;
  const trackDownloadLinksCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackDownloadLinks')).node;
  const trackOutboundLinksCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('trackExternalLinks')).node;
  const keepUrlParametersCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('linkLeaveQueryString')).node;

  const linkDownloadFileTypesTagListEditor =
    wrapper.find(TagListEditor).filterWhere(n => n.prop('title') === 'Download Extensions').node;
  const linkExternalFiltersTagListEditor =
    wrapper.find(TagListEditor).filterWhere(n => n.prop('title') === 'Track').node;
  const linkInternalFiltersTagListEditor =
    wrapper.find(TagListEditor).filterWhere(n => n.prop('title') === 'Never Track').node;

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
    const FormComponent = extensionViewReduxForm(formConfig)(LinkTracking);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
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
    expect(linkDownloadFileTypesTagListEditor.props.value).toEqual(['avi', 'exe']);
    expect(linkInternalFiltersTagListEditor.props.value).toEqual(['tel:', 'mailto:']);
    expect(linkExternalFiltersTagListEditor.props.value)
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

    linkDownloadFileTypesTagListEditor.props.onChange(['avi', 'exe']);
    linkInternalFiltersTagListEditor.props.onChange(['tel:', 'mailto:']);
    linkExternalFiltersTagListEditor.props.onChange(['http://someurl.com', 'http://someurl2.com']);

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

  it('has the correct default values', () => {
    extensionBridge.init();

    const {
      enableTrackInlineStatsCheckbox,
      trackDownloadLinksCheckbox,
      trackOutboundLinksCheckbox,
      linkDownloadFileTypesTagListEditor,
      linkInternalFiltersTagListEditor
    } = getReactComponents(instance);

    expect(enableTrackInlineStatsCheckbox.props.value).toBe(true);
    expect(trackDownloadLinksCheckbox.props.value).toBe(true);
    expect(trackOutboundLinksCheckbox.props.value).toBe(true);
    expect(linkDownloadFileTypesTagListEditor.props.value.length).toBeGreaterThan(0);
    expect(linkInternalFiltersTagListEditor.props.value.length).toBeGreaterThan(0);
  });
});
