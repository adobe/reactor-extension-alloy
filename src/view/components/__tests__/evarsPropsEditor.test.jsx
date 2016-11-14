import { mount } from 'enzyme';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';

import EvarsPropsEditor, { getFormConfig } from '../evarsPropsEditor';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map((row) => {
    const nameField = row.find(Field).filterWhere(n => n.prop('name').indexOf('.name') !== -1);
    const valueField = row.find(Field).filterWhere(n => n.prop('name').indexOf('.value') !== -1);
    return {
      nameAutocomplete: nameField.find(Autocomplete).node,
      nameErrorTip: nameField.find(ErrorTip).node,
      typeSelect: row.find(Select).node,
      valueTextfield: valueField.find(Textfield).node || valueField.find(Autocomplete).node,
      valueErrorTip: valueField.find(ErrorTip).node,
      removeButton: row.find(Button).filterWhere(n => n.prop('icon') === 'close').node
    };
  });

  const addRowButton = wrapper.find(Button).last().node;

  return {
    rows,
    addRowButton
  };
};

describe('evars props editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(EvarsPropsEditor, getFormConfig('eVar', 'eVars'), extensionBridge, {
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

    const { rows } = getReactComponents(instance);

    expect(rows[0].nameAutocomplete.props.value).toBe('eVar1');
    expect(rows[0].typeSelect.props.value).toBe('value');
    expect(rows[0].valueTextfield.props.value).toBe('eVar1Value');

    expect(rows[1].nameAutocomplete.props.value).toBe('eVar2');
    expect(rows[1].typeSelect.props.value).toBe('alias');
    expect(rows[1].valueTextfield.props.value).toBe('eVar1');
  });

  it('sets settings from form values for value type', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameAutocomplete.props.onChange({ value: 'eVar1' });
    rows[0].typeSelect.props.onChange({ value: 'value' });
    rows[0].valueTextfield.props.onChange('some value');

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar1');
    expect(eVars[0].type).toBe('value');
    expect(eVars[0].value).toBe('some value');
  });


  it('sets settings from form values for alias type', () => {
    extensionBridge.init();

    let { rows } = getReactComponents(instance);

    rows[0].typeSelect.props.onChange({ value: 'alias' });

    ({ rows } = getReactComponents(instance));

    rows[0].nameAutocomplete.props.onChange({ value: 'eVar2' });
    rows[0].valueTextfield.props.onChange({ value: 'eVar1' });

    const { eVars } = extensionBridge.getSettings().trackerProperties;
    expect(eVars[0].name).toBe('eVar2');
    expect(eVars[0].type).toBe('alias');
    expect(eVars[0].value).toBe('eVar1');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    let components = getReactComponents(instance);

    expect(components.rows.length).toBe(1);

    components.addRowButton.props.onClick();

    components = getReactComponents(instance);

    expect(components.rows.length).toBe(2);
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

    let { rows } = getReactComponents(instance);

    expect(rows.length).toBe(2);

    rows[1].removeButton.props.onClick();

    ({ rows } = getReactComponents(instance));

    expect(rows.length).toBe(1);

    expect(rows[0].nameAutocomplete.props.value).toContain('eVar1');
  });

  it('shows an error when two evars having the same name are added', () => {
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

    const { rows } = getReactComponents(instance);

    expect(rows[1].nameErrorTip).toBeDefined();
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

    const { rows } = getReactComponents(instance);
    expect(rows[0].nameErrorTip).toBeDefined();
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

    const { rows } = getReactComponents(instance);
    expect(rows[0].valueErrorTip).toBeDefined();
  });
});
