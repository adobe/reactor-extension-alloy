import extensionViewReduxForm from '../../../extensionViewReduxForm';
import CharSet, { formConfig } from '../charSet';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('char set', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(CharSet);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'UTF-8'
        }
      }
    });

    const { charSetPresetSelect } = instance.refs;
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

    const { charSetCustomTextfield } = instance.refs;
    expect(charSetCustomTextfield.props.value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { charSetPresetSelect } = instance.refs;

    charSetPresetSelect.props.onChange('UTF-8');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('UTF-8');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customCharSetInputMethodRadio } = instance.refs;
    customCharSetInputMethodRadio.props.onChange('custom');

    const { charSetCustomTextfield } = instance.refs;
    charSetCustomTextfield.props.onChange('some custom');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { charSetPresetSelect } = instance.refs;

    charSetPresetSelect.props.onChange('ASCII');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBeUndefined();
  });
});
