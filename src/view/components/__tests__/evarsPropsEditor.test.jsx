import extensionViewReduxForm from '../../extensionViewReduxForm';
import evarsPropsEditor, { getFormConfig } from '../evarsPropsEditor';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('events editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(getFormConfig('eVar', 'eVars'))(evarsPropsEditor);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge, {
      varType: 'eVar',
      varTypePlural: 'eVars'
    });
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          eVars: [
            {
              name: 'eVar1',
              type: 'value',
              value: 'eVar1Value'
            },
            {
              name: 'eVar2',
              type: 'alias',
              value: 'eVar1'
            }
          ]
        }
      }
    });

    const {
      nameSelect0,
      typeSelect0,
      valueTextfield0,
      nameSelect1,
      typeSelect1,
      valueSelect1
    } = instance.refs;

    expect(nameSelect0.props.value).toBe('eVar1');
    expect(typeSelect0.props.value).toBe('value');
    expect(valueTextfield0.props.value).toBe('eVar1Value');

    expect(nameSelect1.props.value).toBe('eVar2');
    expect(typeSelect1.props.value).toBe('alias');
    expect(valueSelect1.props.value).toBe('eVar1');
  });

  it('sets settings from form values for value type', () => {
    extensionBridge.init();

    const {
      nameSelect0,
      typeSelect0,
      valueTextfield0
    } = instance.refs;

    nameSelect0.props.onChange('eVar1');
    typeSelect0.props.onChange('value');
    valueTextfield0.props.onChange('some value');

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar1');
    expect(eVars[0].type).toBe('value');
    expect(eVars[0].value).toBe('some value');
  });


  it('sets settings from form values for alias type', () => {
    extensionBridge.init();

    const {
      typeSelect0,
    } = instance.refs;

    typeSelect0.props.onChange('alias');

    const {
      nameSelect0,
      valueSelect0
    } = instance.refs;

    nameSelect0.props.onChange('eVar2');
    valueSelect0.props.onChange('eVar1');

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar2');
    expect(eVars[0].type).toBe('alias');
    expect(eVars[0].value).toBe('eVar1');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    const {
      addEventButton
    } = instance.refs;

    let {
      nameSelect1,
      typeSelect1,
      valueTextfield1
    } = instance.refs;

    expect(nameSelect1).toBeUndefined();
    expect(typeSelect1).toBeUndefined();
    expect(valueTextfield1).toBeUndefined();

    addEventButton.props.onClick();


    ({
      nameSelect1,
      typeSelect1,
      valueTextfield1
    } = instance.refs);

    expect(nameSelect1).toBeDefined();
    expect(typeSelect1).toBeDefined();
    expect(valueTextfield1).toBeDefined();
  });

  it('deletes a row when the remove button is clicked', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          eVars: [
            {
              name: 'eVar1',
              type: 'value',
              value: 'eVar1Value'
            }
          ]
        }
      }
    });

    let {
      nameSelect1,
      typeSelect1,
      valueTextfield1
    } = instance.refs;

    expect(nameSelect1).toBeDefined();
    expect(typeSelect1).toBeDefined();
    expect(valueTextfield1).toBeDefined();

    const {
      removeButton1
    } = instance.refs;

    removeButton1.props.onClick();


    ({
      nameSelect1,
      typeSelect1,
      valueTextfield1
    } = instance.refs);

    expect(nameSelect1).toBeUndefined();
    expect(typeSelect1).toBeUndefined();
    expect(valueTextfield1).toBeUndefined();
  });

  it('shows an error when two events having the same name are added', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          eVars: [
            {
              name: 'eVar1',
              type: 'value',
              value: 'eVar1Value'
            },
            {
              name: 'eVar1',
              type: 'alias',
              value: 'eVar2'
            }
          ]
        }
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper1 } = instance.refs;
    expect(nameWrapper1.props.error).toEqual(jasmine.any(String));
  });

  it('shows an error when an event doesn\'t have a name', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          eVars: [
            {
              name: '',
              type: 'value',
              value: 'a'
            }
          ]
        }
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { nameWrapper0 } = instance.refs;
    expect(nameWrapper0.props.error).toEqual(jasmine.any(String));
  });

  it('shows an error when an event doesn\'t have a value', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          eVars: [
            {
              name: 'eVar1',
              type: 'value',
              value: ''
            }
          ]
        }
      }
    });

    expect(extensionBridge.validate()).toBe(false);

    const { valueWrapper0 } = instance.refs;
    expect(valueWrapper0.props.error).toEqual(jasmine.any(String));
  });
});
