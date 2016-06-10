import extensionViewReduxForm from '../../extensionViewReduxForm';
import { SendBeacon, formConfig } from '../sendBeacon';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('send beacon', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(SendBeacon);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets page view form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'page'
      }
    });

    const {
      pageViewTypeRadio
    } = instance.refs;

    expect(pageViewTypeRadio.props.checked).toBe(true);
  });


  it('sets link form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'link',
        linkType: 'd',
        linkName: 'some name'
      }
    });

    const {
      linkTypeRadio,
      linkTypeSelect,
      linkNameTextfield
    } = instance.refs;

    expect(linkTypeRadio.props.checked).toBe(true);
    expect(linkTypeSelect.props.value).toBe('d');
    expect(linkNameTextfield.props.value).toBe('some name');
  });

  it('sets page view settings from form values', () => {
    extensionBridge.init();

    const {
      pageViewTypeRadio,
      linkTypeRadio
    } = instance.refs;

    linkTypeRadio.props.onChange('link');
    pageViewTypeRadio.props.onChange('page');

    const {
      type
    } = extensionBridge.getSettings();

    expect(type).toBe('page');
  });

  it('sets link view settings from form values', () => {
    extensionBridge.init();

    const {
      linkTypeRadio
    } = instance.refs;

    linkTypeRadio.props.onChange('link');

    const {
      linkTypeSelect, 
      linkNameTextfield
    } = instance.refs;

    linkTypeSelect.props.onChange('e');
    linkNameTextfield.props.onChange('some text');

    const {
      type,
      linkType,
      linkName
    } = extensionBridge.getSettings();

    expect(type).toBe('link');
    expect(linkType).toBe('e');
    expect(linkName).toBe('some text');
  });

  it('increment a page view radio is selected by default', () => {
    extensionBridge.init();

    const {
      pageViewTypeRadio
    } = instance.refs;

    const {
      type
    } = extensionBridge.getSettings();

    expect(pageViewTypeRadio.props.checked).toBe(true);
    expect(type).toBe('page');
  });

  it('opens the data element selector from data element button', () => {
    const {
      linkTypeRadio
    } = instance.refs;

    linkTypeRadio.props.onChange('link');

    const {
      linkNameTextfield,
      linkNameButton
    } = instance.refs;

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    linkNameButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(linkNameTextfield.props.value).toBe('%foo%');
  });

});
