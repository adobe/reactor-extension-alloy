import { mount } from 'enzyme';
import { ReduxFormAutocomplete as Autocomplete, ValidationWrapper } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';

import extensionViewReduxForm from '../../extensionViewReduxForm';
import eventsEditor, { formConfig } from '../eventsEditor';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const eventNameAutocompletes = wrapper.find(Autocomplete);
  const eventValueTextfields = wrapper.find(Textfield);
  const addEventButton = wrapper.find(Button).last().node;
  const removeButtons = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'close');
  const nameWrappers = wrapper.find(ValidationWrapper);

  return {
    eventNameAutocompletes,
    eventValueTextfields,
    addEventButton,
    removeButtons,
    nameWrappers
  };
};

describe('events editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(eventsEditor);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
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

    const {
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance);

    expect(eventNameAutocompletes.nodes[0].props.value).toBe('prodView');
    expect(eventValueTextfields.nodes[0].props.value).toBe('a');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance);

    eventNameAutocompletes.nodes[0].props.onChange('event1');
    eventValueTextfields.nodes[0].props.onChange('b');

    const { events } = extensionBridge.getSettings().trackerProperties;
    expect(events[0].name).toBe('event1');
    expect(events[0].value).toBe('b');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    const {
      addEventButton
    } = getReactComponents(instance);

    let {
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance);

    expect(eventNameAutocompletes.length).toBe(1);
    expect(eventValueTextfields.length).toBe(1);

    addEventButton.props.onClick();

    ({
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance));

    expect(eventNameAutocompletes.length).toBe(2);
    expect(eventValueTextfields.length).toBe(2);
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

    let {
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance);

    expect(eventNameAutocompletes.length).toBe(2);
    expect(eventValueTextfields.length).toBe(2);

    const {
      removeButtons
    } = getReactComponents(instance);

    removeButtons.nodes[1].props.onClick();

    ({
      eventNameAutocompletes,
      eventValueTextfields
    } = getReactComponents(instance));

    expect(eventNameAutocompletes.length).toBe(1);
    expect(eventValueTextfields.length).toBe(1);

    expect(eventNameAutocompletes.nodes[0].props.name).toContain('events[0]');
    expect(eventValueTextfields.nodes[0].props.name).toContain('events[0]');
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

    const { nameWrappers } = getReactComponents(instance);
    expect(nameWrappers.nodes[1].props.error).toEqual(jasmine.any(String));
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

    const { nameWrappers } = getReactComponents(instance);
    expect(nameWrappers.nodes[0].props.error).toEqual(jasmine.any(String));
  });
});
