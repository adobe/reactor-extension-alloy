import { mount } from 'enzyme';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import CharSet, { formConfig } from '../charSet';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const charSetPresetSelect = wrapper.find(Select).node;
  const charSetCustomTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('charSet')).node;
  const customCharSetInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  return {
    charSetPresetSelect,
    charSetCustomTextfield,
    customCharSetInputMethodRadio
  };
};

describe('char set', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(CharSet);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'UTF-8'
        }
      }
    });

    const { charSetPresetSelect } = getReactComponents(instance);
    expect(charSetPresetSelect.props.value).toBe('UTF-8');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'another non preset value'
        }
      }
    });

    const { charSetCustomTextfield } = getReactComponents(instance);
    expect(charSetCustomTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { charSetPresetSelect } = getReactComponents(instance);

    charSetPresetSelect.props.onChange('UTF-8');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('UTF-8');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customCharSetInputMethodRadio } = getReactComponents(instance);
    customCharSetInputMethodRadio.props.onChange('custom');

    const { charSetCustomTextfield } = getReactComponents(instance);
    charSetCustomTextfield.props.onChange('some custom');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { charSetPresetSelect } = getReactComponents(instance);

    charSetPresetSelect.props.onChange('ASCII');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBeUndefined();
  });
});
