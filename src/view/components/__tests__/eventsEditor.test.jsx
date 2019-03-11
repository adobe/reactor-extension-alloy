/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import { mount } from 'enzyme';
import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';

import RestrictedComboBox from '../../extensionConfiguration/components/restrictedComboBox';
import EventsEditor, { formConfig } from '../eventsEditor';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map((row) => {
    const nameField = row.find(RestrictedComboBox);
    const valField = row.find(Textfield).filterWhere(n =>
      n.prop('name') && n.prop('name').indexOf('.value') !== -1
    );
    const idField = row.find(Textfield).filterWhere(n =>
      n.prop('name') && n.prop('name').indexOf('.id') !== -1
    );
    return {
      nameAutocomplete: nameField,
      valueTextfield: valField,
      idTextfield: idField,
      removeButton: row.find(Button).last()
    };
  });

  const addRowButton = wrapper.find(Button).last();

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
              value: 'a',
              id: 'b'
            }
          ]
        }
      }
    });

    const { rows } = getReactComponents(instance);

    expect(rows[0].nameAutocomplete.props().value).toBe('prodView');
    expect(rows[0].valueTextfield.props().value).toBe('a');
    expect(rows[0].idTextfield.props().value).toBe('b');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameAutocomplete.props().onChange('event1');
    rows[0].valueTextfield.props().onChange('b');
    rows[0].idTextfield.props().onChange('c');

    const { events } = extensionBridge.getSettings().trackerProperties;
    expect(events[0].name).toBe('event1');
    expect(events[0].value).toBe('b');
    expect(events[0].id).toBe('c');
  });

  it('adds a new row when the add button is clicked', () => {
    extensionBridge.init();

    let components = getReactComponents(instance);

    expect(components.rows.length).toBe(1);

    components.addRowButton.props().onClick();

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

    rows[1].removeButton.props().onClick();

    ({ rows } = getReactComponents(instance));

    expect(rows.length).toBe(1);
    expect(rows[0].nameAutocomplete.props().value).toBe('prodView');
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
    expect(rows[1].nameAutocomplete.props().validationState).toBe('invalid');
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
    expect(rows[0].nameAutocomplete.props().validationState).toBe('invalid');
  });
});
