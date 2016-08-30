import { mount } from 'enzyme';
import { ReduxFormAutocomplete as Autocomplete } from '@reactor/react-components';
import Radio from '@coralui/react-coral/lib/Radio';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import CurrencyCode, { formConfig } from '../currencyCode';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const currencyCodePresetAutocomplete = wrapper.find(Autocomplete).node;
  const currencyCustomTextfield = wrapper.find(Textfield).node;
  const customCurrencyCodeInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  return {
    currencyCodePresetAutocomplete,
    currencyCustomTextfield,
    customCurrencyCodeInputMethodRadio
  };
};

describe('currency code', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(CurrencyCode);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'EUR'
        }
      }
    });

    const { currencyCodePresetAutocomplete } = getReactComponents(instance);
    expect(currencyCodePresetAutocomplete.props.value).toBe('EUR');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'another non preset value'
        }
      }
    });

    const { currencyCustomTextfield } = getReactComponents(instance);
    expect(currencyCustomTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { currencyCodePresetAutocomplete } = getReactComponents(instance);
    currencyCodePresetAutocomplete.props.onChange('EUR');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('EUR');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customCurrencyCodeInputMethodRadio } = getReactComponents(instance);
    customCurrencyCodeInputMethodRadio.props.onChange('custom');

    const { currencyCustomTextfield } = getReactComponents(instance);
    currencyCustomTextfield.props.onChange('some custom');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { currencyCodePresetAutocomplete } = getReactComponents(instance);

    currencyCodePresetAutocomplete.props.onChange('USD');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBeUndefined();
  });
});
