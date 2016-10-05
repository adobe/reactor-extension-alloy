import { mount } from 'enzyme';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import CharSet, { formConfig } from '../charSet';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const presetSelect = wrapper.find(Select).node;
  const customTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('charSet')).node;
  const customInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  return {
    presetSelect,
    customTextfield,
    customInputMethodRadio
  };
};

describe('char set', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CharSet, formConfig, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'UTF-8'
        }
      }
    });

    const { presetSelect } = getReactComponents(instance);
    expect(presetSelect.props.value).toBe('UTF-8');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'another non preset value'
        }
      }
    });

    const { customTextfield } = getReactComponents(instance);
    expect(customTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { presetSelect } = getReactComponents(instance);

    presetSelect.props.onChange({ value: 'UTF-8' });

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('UTF-8');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customInputMethodRadio } = getReactComponents(instance);
    customInputMethodRadio.props.onChange('custom');

    const { customTextfield } = getReactComponents(instance);
    customTextfield.props.onChange('some custom');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { presetSelect } = getReactComponents(instance);

    presetSelect.props.onChange({ value: 'ASCII' });

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBeUndefined();
  });
});
