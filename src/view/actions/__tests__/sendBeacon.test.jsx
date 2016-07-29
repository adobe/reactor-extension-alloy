import { mount } from 'enzyme';
import { DataElementSelectorButton } from '@reactor/react-components';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import { SendBeacon, formConfig } from '../sendBeacon';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const pageViewTypeRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'page').node;
  const linkTypeRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'link').node;
  const linkTypeSelect = wrapper.find(Select).filterWhere(n => n.prop('name') === 'linkType').node;
  const linkNameTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'linkName').node;
  const linkNameButton = wrapper.find(DataElementSelectorButton).node;

  return {
    pageViewTypeRadio,
    linkTypeRadio,
    linkTypeSelect,
    linkNameTextfield,
    linkNameButton
  };
};

describe('send beacon', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(SendBeacon);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));

    window.extensionBridge = extensionBridge;
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('sets page view form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'page'
      }
    });

    const { pageViewTypeRadio } = getReactComponents(instance);
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
    } = getReactComponents(instance);

    expect(linkTypeRadio.props.checked).toBe(true);
    expect(linkTypeSelect.props.value).toBe('d');
    expect(linkNameTextfield.props.value).toBe('some name');
  });

  it('sets page view settings from form values', () => {
    extensionBridge.init();

    const {
      pageViewTypeRadio,
      linkTypeRadio
    } = getReactComponents(instance);

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
    } = getReactComponents(instance);

    linkTypeRadio.props.onChange('link');

    const { linkTypeSelect,
      linkNameTextfield
    } = getReactComponents(instance);

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
    } = getReactComponents(instance);

    const {
      type
    } = extensionBridge.getSettings();

    expect(pageViewTypeRadio.props.checked).toBe(true);
    expect(type).toBe('page');
  });

  it('opens the data element selector from data element button', () => {
    const {
      linkTypeRadio
    } = getReactComponents(instance);

    linkTypeRadio.props.onChange('link');

    const {
      linkNameTextfield,
      linkNameButton
    } = getReactComponents(instance);

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    linkNameButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(linkNameTextfield.props.value).toBe('%foo%');
  });
});
