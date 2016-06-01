import extensionViewReduxForm from '../../../extensionViewReduxForm';
import General, { formConfig } from '../general';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('general', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(General);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        euComplianceEnabled: true,
        trackerProperties: {
          trackingServer: 'someserver',
          trackingServerSecure: 'somesecureserver',
          dc: 'sjo'
        }
      }
    });

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield,
      dcSelect
    } = instance.refs;

    expect(euComplianceEnabledCheckbox.props.value).toBe(true);
    expect(trackingServerTextfield.props.value).toBe('someserver');
    expect(trackingServerSecureTextfield.props.value).toBe('somesecureserver');
    expect(dcSelect.props.value).toBe('sjo');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield,
      dcSelect
    } = instance.refs;

    euComplianceEnabledCheckbox.props.onChange(true);
    trackingServerTextfield.props.onChange('someserver');
    trackingServerSecureTextfield.props.onChange('somesecureserver');
    dcSelect.props.onChange('sjo');

    const { euComplianceEnabled } = extensionBridge.getSettings();
    const {
      trackingServer,
      trackingServerSecure,
      dc
    } = extensionBridge.getSettings().trackerProperties;

    expect(euComplianceEnabled).toBe(true);
    expect(trackingServer).toBe('someserver');
    expect(trackingServerSecure).toBe('somesecureserver');
    expect(dc).toBe('sjo');
  });
});
