import { mount } from 'enzyme';
import Alert from '@coralui/react-coral/lib/Alert';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';
import ErrorTip from '@reactor/react-components/lib/errorTip';

import ClearVariables, { formConfig } from '../clearVariables';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const subsetExtensionConfigurationRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'subset').node;
  const extensionConfigurationIdsSelect = wrapper.find(Select).node;
  const extensionConfigurationIdsErrorTip = wrapper.find(ErrorTip).node;
  const noConfiguraionAlert = wrapper.find(Alert).node;

  return {
    subsetExtensionConfigurationRadio,
    extensionConfigurationIdsSelect,
    extensionConfigurationIdsErrorTip,
    noConfiguraionAlert
  };
};

describe('clear variables', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(ClearVariables, formConfig, extensionBridge));
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

    expect(extensionBridge.validate()).toBe(false);

    const { extensionConfigurationIdsErrorTip } = getReactComponents(instance);

    expect(extensionConfigurationIdsErrorTip).toBeDefined();
  });

  it('shows a warning when no extension configuration is present', () => {
    extensionBridge.init();
    const { noConfiguraionAlert } = getReactComponents(instance);

    expect(noConfiguraionAlert).toBeDefined();
  });
});
