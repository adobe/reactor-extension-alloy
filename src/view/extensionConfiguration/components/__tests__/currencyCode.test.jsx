import { mount } from 'enzyme';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import CurrencyCode, { formConfig } from '../currencyCode';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const presetAutocomplete = wrapper.find(Autocomplete).node;
  const customTextfield = wrapper.find(Textfield).node;
  const customInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  return {
    presetAutocomplete,
    customTextfield,
    customInputMethodRadio
  };
};

describe('currency code', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CurrencyCode, formConfig, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'EUR'
        }
      }
    });

    const { presetAutocomplete } = getReactComponents(instance);
    expect(presetAutocomplete.props.value).toBe('EUR');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'another non preset value'
        }
      }
    });

    const { customTextfield } = getReactComponents(instance);
    expect(customTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { presetAutocomplete } = getReactComponents(instance);
    presetAutocomplete.props.onChange({ value: 'EUR' });

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('EUR');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customInputMethodRadio } = getReactComponents(instance);
    customInputMethodRadio.props.onChange('custom');

    const { customTextfield } = getReactComponents(instance);
    customTextfield.props.onChange('some custom');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { presetAutocomplete } = getReactComponents(instance);

    presetAutocomplete.props.onChange({ value: 'USD' });

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBeUndefined();
  });
});
