import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import General, { formConfig } from '../general';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const euComplianceEnabledCheckbox = wrapper.find(Checkbox).node;
  const trackingServerTextfield =
    wrapper.find(Textfield).filterWhere(
      n => n.prop('name') === 'trackerProperties.trackingServer'
    ).node;
  const trackingServerSecureTextfield =
    wrapper.find(Textfield).filterWhere(
      n => n.prop('name') === 'trackerProperties.trackingServerSecure'
    ).node;
  const dcSelect = wrapper.find(Select).filterWhere(n => n.prop('name').includes('dc')).node;

  return {
    euComplianceEnabledCheckbox,
    trackingServerTextfield,
    trackingServerSecureTextfield,
    dcSelect
  };
};

describe('general', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(General);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        euComplianceEnabled: true,
        trackerProperties: {
          trackingServer: 'someserver',
          trackingServerSecure: 'somesecureserver',
          dc: '112'
        }
      }
    });

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield,
      dcSelect
    } = getReactComponents(instance);

    expect(euComplianceEnabledCheckbox.props.value).toBe(true);
    expect(trackingServerTextfield.props.value).toBe('someserver');
    expect(trackingServerSecureTextfield.props.value).toBe('somesecureserver');
    expect(dcSelect.props.value).toBe('112');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield,
      dcSelect
    } = getReactComponents(instance);

    euComplianceEnabledCheckbox.props.onChange(true);
    trackingServerTextfield.props.onChange('someserver');
    trackingServerSecureTextfield.props.onChange('somesecureserver');
    dcSelect.props.onChange('112');

    const { euComplianceEnabled } = extensionBridge.getSettings();
    const {
      trackerProperties: {
        trackingServer,
        trackingServerSecure,
        dc
      }
    } = extensionBridge.getSettings();

    expect(euComplianceEnabled).toBe(true);
    expect(trackingServer).toBe('someserver');
    expect(trackingServerSecure).toBe('somesecureserver');
    expect(dc).toBe('112');
  });
});
