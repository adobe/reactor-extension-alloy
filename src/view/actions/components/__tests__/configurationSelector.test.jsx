import { mount } from 'enzyme';
import { Alert, Radio, Select } from '@coralui/react-coral';
import { ValidationWrapper } from '@reactor/react-components';

import ConfigurationSelector, { formConfig } from '../configurationSelector';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const subsetExtensionConfigurationRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'subset').node;
  const extensionConfigurationIdsSelect = wrapper.find(Select).node;
  const extensionConfigurationIdsWrapper = wrapper.find(ValidationWrapper).node;
  const noConfiguraionAlert = wrapper.find(Alert).node;

  return {
    subsetExtensionConfigurationRadio,
    extensionConfigurationIdsSelect,
    extensionConfigurationIdsWrapper,
    noConfiguraionAlert
  };
};

describe('configuration selector', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ConfigurationSelector, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      extensionConfigurations: [
        { id: 'EC1' },
        { id: 'EC2' }
      ],
      settings: {
        extensionConfigurationIds: ['EC1', 'EC2']
      }
    });

    const {
      subsetExtensionConfigurationRadio,
      extensionConfigurationIdsSelect
    } = getReactComponents(instance);

    expect(subsetExtensionConfigurationRadio.props.checked).toBe(true);
    expect(extensionConfigurationIdsSelect.props.value).toEqual(['EC1', 'EC2']);
  });

  it('sets settings from form values', () => {
    extensionBridge.init({
      extensionConfigurations: [
        { id: 'EC1' },
        { id: 'EC2' }
      ]
    });

    const { subsetExtensionConfigurationRadio } = getReactComponents(instance);
    subsetExtensionConfigurationRadio.props.onChange('subset');

    const { extensionConfigurationIdsSelect } = getReactComponents(instance);
    extensionConfigurationIdsSelect.props.onChange([{ value: 'EC1' }]);

    const { extensionConfigurationIds } = extensionBridge.getSettings();
    expect(extensionConfigurationIds).toEqual(['EC1']);
  });

  it('sets error if no configuration id is selected', () => {
    extensionBridge.init({
      extensionConfigurations: [
        { id: 'EC1' },
        { id: 'EC2' }
      ]
    });

    const { subsetExtensionConfigurationRadio } = getReactComponents(instance);
    subsetExtensionConfigurationRadio.props.onChange('subset');

    const { extensionConfigurationIdsWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(extensionConfigurationIdsWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('shows a warning when no extension configuration is present', () => {
    extensionBridge.init();
    const { noConfiguraionAlert } = getReactComponents(instance);

    expect(noConfiguraionAlert).toBeDefined();
  });

  it('does not render anything when only 1 configuration is available', () => {
    extensionBridge.init({
      extensionConfigurations: [
        { id: 'EC1' }
      ]
    });

    expect(instance.find(ConfigurationSelector).html()).toBeNull();
  });
});
