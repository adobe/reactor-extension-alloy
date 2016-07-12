import { mount } from 'enzyme';
import { ReduxFormAutocomplete as Autocomplete, ValidationWrapper } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import evarsPropsEditor, { getFormConfig } from '../evarsPropsEditor';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const nameAutocompletes =
    wrapper.find(Autocomplete).filterWhere(n => n.prop('placeholder') === 'Select eVar');
  const typeSelects = wrapper.find(Select);
  const valueTextfields = wrapper.find(Textfield);
  const valueAutocompletes =
    wrapper.find(Autocomplete).filterWhere(n => n.prop('placeholder') === 'Select variable');
  const addEventButton = wrapper.find(Button).last().node;
  const removeButtons = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'close');
  const nameWrappers = wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'name');
  const valueWrappers =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'value');

  return {
    nameAutocompletes,
    typeSelects,
    valueTextfields,
    valueAutocompletes,
    addEventButton,
    removeButtons,
    nameWrappers,
    valueWrappers
  };
};

describe('events editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(getFormConfig('eVar', 'eVars'))(evarsPropsEditor);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge, {
      varType: 'eVar',
      varTypePlural: 'eVars'
    }));
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
      nameAutocompletes,
      typeSelects,
      valueTextfields,
      valueAutocompletes
    } = getReactComponents(instance);

    expect(nameAutocompletes.nodes[0].props.value).toBe('eVar1');
    expect(typeSelects.nodes[0].props.value).toBe('value');
    expect(valueTextfields.nodes[0].props.value).toBe('eVar1Value');

    expect(nameAutocompletes.nodes[1].props.value).toBe('eVar2');
    expect(typeSelects.nodes[1].props.value).toBe('alias');
    expect(valueAutocompletes.nodes[0].props.value).toBe('eVar1');
  });

  it('sets settings from form values for value type', () => {
    extensionBridge.init();

    const {
      nameAutocompletes,
      typeSelects,
      valueTextfields
    } = getReactComponents(instance);

    nameAutocompletes.nodes[0].props.onChange('eVar1');
    typeSelects.nodes[0].props.onChange('value');
    valueTextfields.nodes[0].props.onChange('some value');

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar1');
    expect(eVars[0].type).toBe('value');
    expect(eVars[0].value).toBe('some value');
  });


  it('sets settings from form values for alias type', () => {
    extensionBridge.init();

    const {
      typeSelects
    } = getReactComponents(instance);

    typeSelects.nodes[0].props.onChange('alias');

    const {
      nameAutocompletes,
      valueAutocompletes
    } = getReactComponents(instance);

    nameAutocompletes.nodes[0].props.onChange('eVar2');
    valueAutocompletes.nodes[0].props.onChange('eVar1');

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar2');
    expect(eVars[0].type).toBe('alias');
    expect(eVars[0].value).toBe('eVar1');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    const {
      addEventButton
    } = getReactComponents(instance);

    let {
      nameAutocompletes,
      typeSelects,
      valueTextfields
    } = getReactComponents(instance);

    expect(nameAutocompletes.length).toBe(1);
    expect(typeSelects.length).toBe(1);
    expect(valueTextfields.length).toBe(1);

    addEventButton.props.onClick();

    ({
      nameAutocompletes,
      typeSelects,
      valueTextfields
    } = getReactComponents(instance));

    expect(nameAutocompletes.length).toBe(2);
    expect(typeSelects.length).toBe(2);
    expect(valueTextfields.length).toBe(2);
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
      nameAutocompletes,
      typeSelects,
      valueTextfields
    } = getReactComponents(instance);

    expect(nameAutocompletes.length).toBe(2);
    expect(typeSelects.length).toBe(2);
    expect(valueTextfields.length).toBe(2);

    const {
      removeButtons
    } = getReactComponents(instance);

    removeButtons.nodes[1].props.onClick();

    ({
      nameAutocompletes,
      typeSelects,
      valueTextfields
    } = getReactComponents(instance));

    expect(nameAutocompletes.length).toBe(1);
    expect(typeSelects.length).toBe(1);
    expect(valueTextfields.length).toBe(1);

    expect(nameAutocompletes.nodes[0].props.name).toContain('eVars[0]');
    expect(typeSelects.nodes[0].props.name).toContain('eVars[0]');
    expect(valueTextfields.nodes[0].props.name).toContain('eVars[0]');
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

    const { nameWrappers } = getReactComponents(instance);
    expect(nameWrappers.nodes[1].props.error).toEqual(jasmine.any(String));
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

    const { nameWrappers } = getReactComponents(instance);
    expect(nameWrappers.nodes[0].props.error).toEqual(jasmine.any(String));
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

    const { valueWrappers } = getReactComponents(instance);
    expect(valueWrappers.nodes[0].props.error).toEqual(jasmine.any(String));
  });
});
