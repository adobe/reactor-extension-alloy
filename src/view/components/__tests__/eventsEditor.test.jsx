import extensionViewReduxForm from '../../extensionViewReduxForm';
import eventsEditor, { formConfig } from '../eventsEditor';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('events editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(eventsEditor);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
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
      eventNameSelect0,
      eventValueTextField0
    } = instance.refs;

    expect(eventNameSelect0.props.value).toBe('prodView');
    expect(eventValueTextField0.props.value).toBe('a');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      eventNameSelect0,
      eventValueTextField0
    } = instance.refs;

    eventNameSelect0.props.onChange('event1');
    eventValueTextField0.props.onChange('b');

    const { events } = extensionBridge.getSettings().trackerProperties;
    expect(events[0].name).toBe('event1');
    expect(events[0].value).toBe('b');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    const {
      addEventButton
    } = instance.refs;

    let {
      eventNameSelect1,
      eventValueTextField1
    } = instance.refs;

    expect(eventNameSelect1).toBeUndefined();
    expect(eventValueTextField1).toBeUndefined();

    addEventButton.props.onClick();


    ({
      eventNameSelect1,
      eventValueTextField1
    } = instance.refs);

    expect(eventNameSelect1).toBeDefined();
    expect(eventValueTextField1).toBeDefined();
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
      eventNameSelect1,
      eventValueTextField1
    } = instance.refs;

    expect(eventNameSelect1).toBeDefined();
    expect(eventValueTextField1).toBeDefined();

    const {
      removeButton1
    } = instance.refs;

    removeButton1.props.onClick();


    ({
      eventNameSelect1,
      eventValueTextField1
    } = instance.refs);

    expect(eventNameSelect1).toBeUndefined();
    expect(eventValueTextField1).toBeUndefined();
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

    const { eventNameWrapper1 } = instance.refs;
    expect(eventNameWrapper1.props.error).toEqual(jasmine.any(String));
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

    const { eventNameWrapper0 } = instance.refs;
    expect(eventNameWrapper0.props.error).toEqual(jasmine.any(String));
  });
});
