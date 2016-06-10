import ReactDOM from 'react-dom';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import { ConfigurationSelector, formConfig, stateToProps } from '../configurationSelector';
import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

describe('configuration selector', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig, stateToProps)(ConfigurationSelector);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets page view form values from settings', () => {
    extensionBridge.init({
      extensionConfigurations: [
        {id: 'EC1'},
        {id: 'EC2'}
      ],
      settings: {
        extensionConfigurationIds: ['EC1', 'EC2']
      }
    });

    const {
      subsetExtensionConfigurationRadio,
      extensionConfigurationIdsSelect
    } = instance.refs;

    expect(subsetExtensionConfigurationRadio.props.checked).toBe(true);
    expect(extensionConfigurationIdsSelect.props.value).toEqual(['EC1', 'EC2']);
  });


  it('sets form values from settings', () => {
    extensionBridge.init({
      extensionConfigurations: [
        {id: 'EC1'},
        {id: 'EC2'}
      ]
    });

    const { subsetExtensionConfigurationRadio } = instance.refs;
    subsetExtensionConfigurationRadio.props.onChange('subset');

    const { extensionConfigurationIdsSelect } = instance.refs;
    extensionConfigurationIdsSelect.props.onChange(['EC1']);

    const { extensionConfigurationIds } = extensionBridge.getSettings();
    expect(extensionConfigurationIds).toEqual(['EC1']);
  });


  it('sets error if no configuration id is selected', () => {
    extensionBridge.init({
      extensionConfigurations: [
        {id: 'EC1'},
        {id: 'EC2'}
      ]
    });

    const { subsetExtensionConfigurationRadio } = instance.refs;
    subsetExtensionConfigurationRadio.props.onChange('subset');

    const { extensionConfigurationIdsWrapper } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(extensionConfigurationIdsWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('shows an warning when no extension configuration are present', () => {
    extensionBridge.init();
    const { noConfiguraionAlert } = instance.refs;

    expect(noConfiguraionAlert).toBeDefined();
  });

  it('does not render anything when only 1 configuration is available', () => {
    extensionBridge.init({
      extensionConfigurations: [
        {id: 'EC1'}
      ]
    });

    expect(ReactDOM.findDOMNode(instance)).toBeNull();
  });
});
