import extensionViewReduxForm from '../../extensionViewReduxForm';
import customSetup, { formConfig } from '../customSetup';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('customSetup', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(customSetup);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('opens code editor with script value when button is clicked and stores result', () => {
    const { codeButton } = instance.refs;

    spyOn(window.extensionBridge, 'openCodeEditor').and.callFake((script, callback) => {
      callback('foo');
    });

    codeButton.props.onClick();
    const { customSetup } = extensionBridge.getSettings();

    expect(window.extensionBridge.openCodeEditor).toHaveBeenCalled();
    expect(customSetup.script).toBe('foo');
  });

  it('radio buttons are not visible if code editor has not been used', () => {
    extensionBridge.init();

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = instance.refs;
    expect(loadPhaseBeforeRadio).toBeUndefined();
    expect(loadPhaseAfterRadio).toBeUndefined();
  });

  it('radio buttons are visible after code editor has been used', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          script: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = instance.refs;
    expect(loadPhaseBeforeRadio).toBeDefined();
    expect(loadPhaseAfterRadio).toBeDefined();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          script: 'true',
          loadPhase: 'beforeSettings'
        }
      }
    });

    const { loadPhaseBeforeRadio } = instance.refs;
    expect(loadPhaseBeforeRadio.props.value).toBe('beforeSettings');
  });

  it('sets settings from form values', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          script: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio } = instance.refs;

    loadPhaseBeforeRadio.props.onChange('beforeSettings');

    const { customSetup } = extensionBridge.getSettings();
    expect(customSetup.loadPhase).toBe('beforeSettings');
  });
});
