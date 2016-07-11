import { mount } from 'enzyme';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import { formConfig, ExtensionConfiguration } from '../extensionConfiguration';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const trackingServerTextfield =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'trackingServer').node;
  const trackingServerSecureTextfield = wrapper
    .find(ValidationWrapper).filterWhere(n => n.prop('type') === 'trackingServerSecure').node;

  return {
    trackingServerTextfield,
    trackingServerSecureTextfield
  };
};

describe('extensionConfiguration', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ExtensionConfiguration);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets errors when multiple report suites are defined but tracking servers are not', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'managed',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ]
          }
        }
      }
    });

    const {
      trackingServerTextfield,
      trackingServerSecureTextfield
    } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(trackingServerTextfield.props.error).toEqual(jasmine.any(String));
    expect(trackingServerSecureTextfield.props.error).toEqual(jasmine.any(String));
  });
});
