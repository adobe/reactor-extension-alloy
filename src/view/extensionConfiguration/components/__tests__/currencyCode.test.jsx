import extensionViewReduxForm from '../../../extensionViewReduxForm';
import CurrencyCode, { formConfig } from '../currencyCode';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('currency code', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(CurrencyCode);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'EUR'
        }
      }
    });

    const { currencyCodePresetSelect } = instance.refs;
    expect(currencyCodePresetSelect.props.value).toBe('EUR');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'another non preset value'
        }
      }
    });

    const { currencyCustomTextfield } = instance.refs;
    expect(currencyCustomTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { currencyCodePresetSelect } = instance.refs;
    currencyCodePresetSelect.props.onChange('EUR');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('EUR');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customCurrencyCodeInputMethodRadio } = instance.refs;
    customCurrencyCodeInputMethodRadio.props.onChange('custom');

    const { currencyCustomTextfield } = instance.refs;
    currencyCustomTextfield.props.onChange('some custom');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { currencyCodePresetSelect } = instance.refs;

    currencyCodePresetSelect.props.onChange('USD');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBeUndefined();
  });
});
