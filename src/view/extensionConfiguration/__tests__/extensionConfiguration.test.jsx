import extensionViewReduxForm from '../../extensionViewReduxForm';
import { formConfig, ExtensionConfiguration } from '../extensionConfiguration';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('extensionConfiguration', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(ExtensionConfiguration);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
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
    } = instance.refs.general.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(trackingServerTextfield.props.error).toEqual(jasmine.any(String));
    expect(trackingServerSecureTextfield.props.error).toEqual(jasmine.any(String));
  });
});
