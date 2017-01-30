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
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import HierarchiesEditor, { formConfig } from '../hierarchiesEditor';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';

const getReactComponents = (wrapper) => {
  const rows = wrapper.find('[data-row]').map(row => ({
    nameTextfield: row.find(Select).node,
    sectionTextfields: row.find(Textfield)
      .filterWhere(n => n.prop('name').indexOf('sections') !== -1).nodes,
    delimiterTextfields: row.find(Textfield)
      .filterWhere(n => n.prop('name').indexOf('delimiter') !== -1).node,
    removeButton: row.find(Button).node
  }));

  const addButton = wrapper.find(Button).last().node;

  return {
    rows,
    addButton
  };
};

describe('hierarchies editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(HierarchiesEditor, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          hierarchies: [
            {
              name: 'hier2',
              sections: [
                'a',
                'b',
                'c',
                'd'
              ],
              delimiter: ':'
            }
          ]
        }
      }
    });

    const { rows } = getReactComponents(instance);

    expect(rows[0].nameTextfield.props.value).toBe('hier2');
    expect(rows[0].delimiterTextfields.props.value).toBe(':');
    expect(rows[0].sectionTextfields[0].props.value).toBe('a');
    expect(rows[0].sectionTextfields[1].props.value).toBe('b');
    expect(rows[0].sectionTextfields[2].props.value).toBe('c');
    expect(rows[0].sectionTextfields[3].props.value).toBe('d');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const { rows } = getReactComponents(instance);

    rows[0].nameTextfield.props.onChange({ value: 'hier3' });
    rows[0].delimiterTextfields.props.onChange('-');
    rows[0].sectionTextfields[0].props.onChange('a');
    rows[0].sectionTextfields[1].props.onChange('b');
    rows[0].sectionTextfields[2].props.onChange('c');
    rows[0].sectionTextfields[3].props.onChange('d');

    const {
      trackerProperties
    } = extensionBridge.getSettings();

    const hierarchiesData = trackerProperties.hierarchies[0];

    expect(hierarchiesData.name).toBe('hier3');
    expect(hierarchiesData.delimiter).toBe('-');
    expect(hierarchiesData.sections).toEqual(['a', 'b', 'c', 'd']);
  });

  it('creates a new row when the add button is clicked', () => {
    extensionBridge.init();

    const { addButton } = getReactComponents(instance);
    addButton.props.onClick();

    const { rows } = getReactComponents(instance);

    // First row is visible by default.
    expect(rows.length).toBe(2);
  });

  it('deletes a row when requested from row', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          hierarchies: [
            {
              name: 'hier2',
              sections: [
                'a',
                'b',
                'c',
                'd'
              ],
              delimiter: ':'
            }, {
              name: 'hier4',
              sections: [
                'aa',
                'bb',
                'cc',
                'dd'
              ],
              delimiter: ':'
            }
          ]
        }
      }
    });

    let { rows } = getReactComponents(instance);

    //
    expect(rows.length).toBe(3);
    expect(rows[0].sectionTextfields[0].props.value).toBe('a');
    expect(rows[1].sectionTextfields[0].props.value).toBe('aa');

    rows[0].removeButton.props.onClick();

    ({ rows } = getReactComponents(instance));

    expect(rows.length).toBe(2);
    expect(rows[0].sectionTextfields[0].props.value).toBe('aa');
  });

  describe('validate', () => {
    it('returns false when two hierarchies have the same name', () => {
      extensionBridge.init({
        settings: {
          trackerProperties: {
            hierarchies: [
              {
                name: 'hier1',
                sections: [
                  'a',
                  'b',
                  'c',
                  'd'
                ],
                delimiter: ':'
              }, {
                name: 'hier1',
                sections: [
                  'aa',
                  'bb',
                  'cc',
                  'dd'
                ],
                delimiter: ':'
              }
            ]
          }
        }
      });

      expect(extensionBridge.validate()).toBe(false);
    });

    it('returns false when hierarchy does not have a delimiter', () => {
      extensionBridge.init({
        settings: {
          trackerProperties: {
            hierarchies: [
              {
                name: 'hier1',
                sections: [
                  'a'
                ],
                delimiter: ','
              }
            ]
          }
        }
      });

      const { rows } = getReactComponents(instance);
      rows[0].delimiterTextfields.props.onChange('');

      expect(extensionBridge.validate()).toBe(false);
    });
  });
});
