import { mount } from 'enzyme';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Autocomplete from '@coralui/react-coral/lib/Autocomplete';
import { Field } from 'redux-form';

import EventsEditor, { formConfig } from '../eventsEditor';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map(row => {
    const nameField = row.find(Field).filterWhere(n => n.prop('name').includes('.name'));
    return {
      nameAutocomplete: nameField.find(Autocomplete).node,
      nameErrorTip: nameField.find(ErrorTip).node,
      valueTextfield: row.find(Textfield).node,
      removeButton: row.find(Button).last().node
    };
  });

  const addRowButton = wrapper.find(Button).last().node;

  return {
    rows,
    addRowButton
  };
};

describe('events editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(EventsEditor, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          events: [
            {
              name: 'prodView',
              value: 'a'
            }
          ]
        }
      }
    });

    const { rows } = getReactComponents(instance);

    expect(rows[0].nameAutocomplete.props.value).toBe('prodView');
    expect(rows[0].valueTextfield.props.value).toBe('a');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameAutocomplete.props.onChange({ value: 'event1' });
    rows[0].valueTextfield.props.onChange('b');

    const { events } = extensionBridge.getSettings().trackerProperties;
    expect(events[0].name).toBe('event1');
    expect(events[0].value).toBe('b');
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
          events: [
            {
              name: 'prodView',
              value: 'a'
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
    expect(rows[0].nameAutocomplete.props.value).toBe('prodView');
  });

  it('shows an error when two events having the same name are added', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          events: [
            {
              name: 'prodView',
              value: 'a'
            },
            {
              name: 'prodView',
              value: 'b'
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
          events: [
            {
              name: '',
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
});
