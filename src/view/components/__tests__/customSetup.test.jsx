import { mount } from 'enzyme';
import Button from '@coralui/react-coral/lib/Button';
import Radio from '@coralui/react-coral/lib/Radio';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import CustomSetup, { formConfig } from '../customSetup';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const codeButton = wrapper.find(Button).node;
  const loadPhaseBeforeRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'beforeSettings').node;
  const loadPhaseAfterRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'afterSettings').node;

  return {
    codeButton,
    loadPhaseBeforeRadio,
    loadPhaseAfterRadio
  };
};

describe('customSetup', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(CustomSetup);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    const { codeButton } = getReactComponents(instance);

    spyOn(window.extensionBridge, 'openCodeEditor').and.callFake((source, callback) => {
      callback('foo');
    });

    codeButton.props.onClick();
    const { customSetup } = extensionBridge.getSettings();

    expect(window.extensionBridge.openCodeEditor).toHaveBeenCalled();
    expect(customSetup.source).toBe('foo');
  });

  it('radio buttons are not visible if code editor has not been used', () => {
    extensionBridge.init();

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio).toBeUndefined();
    expect(loadPhaseAfterRadio).toBeUndefined();
  });

  it('radio buttons are visible after code editor has been used', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio).toBeDefined();
    expect(loadPhaseAfterRadio).toBeDefined();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true',
          loadPhase: 'beforeSettings'
        }
      }
    });

    const { loadPhaseBeforeRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio.props.value).toBe('beforeSettings');
  });

  it('sets settings from form values', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio } = getReactComponents(instance);

    loadPhaseBeforeRadio.props.onChange('beforeSettings');

    const { customSetup } = extensionBridge.getSettings();
    expect(customSetup.loadPhase).toBe('beforeSettings');
  });
});
