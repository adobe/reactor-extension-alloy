import { mount } from 'enzyme';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import Button from '@coralui/react-coral/lib/Button';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';

import HierarchiesEditor from '../hierarchiesEditor';
import extensionViewReduxForm from '../../extensionViewReduxForm';
import hierarchiesEditor, { formConfig } from '../hierarchiesEditor';
import { getFormComponent, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const hierarchiesSelects = wrapper.find(Select);
  const delimiterTextfields =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('delimiter'));
  const section0Textfields =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('sections[0]'));
  const section1Textfields =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('sections[1]'));
  const section2Textfields =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('sections[2]'));
  const section3Textfields =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('sections[3]'));
  const addButton = wrapper.find(Button).last().node;

  return {
    hierarchiesSelects,
    delimiterTextfields,
    section0Textfields,
    section1Textfields,
    section2Textfields,
    section3Textfields,
    addButton
  };
};

describe('hierarchies editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(hierarchiesEditor);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
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

    const {
      hierarchiesSelects,
      delimiterTextfields,
      section0Textfields,
      section1Textfields,
      section2Textfields,
      section3Textfields
    } = getReactComponents(instance);

    expect(hierarchiesSelects.nodes[0].props.value).toBe('hier2');
    expect(delimiterTextfields.nodes[0].props.value).toBe(':');
    expect(section0Textfields.nodes[0].props.value).toBe('a');
    expect(section1Textfields.nodes[0].props.value).toBe('b');
    expect(section2Textfields.nodes[0].props.value).toBe('c');
    expect(section3Textfields.nodes[0].props.value).toBe('d');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      hierarchiesSelects,
      delimiterTextfields,
      section0Textfields,
      section1Textfields,
      section2Textfields,
      section3Textfields
    } = getReactComponents(instance);

    hierarchiesSelects.nodes[0].props.onChange('hier3');
    delimiterTextfields.nodes[0].props.onChange('-');
    section0Textfields.nodes[0].props.onChange('a');
    section1Textfields.nodes[0].props.onChange('b');
    section2Textfields.nodes[0].props.onChange('c');
    section3Textfields.nodes[0].props.onChange('d');

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

    const {
      hierarchiesSelects
    } = getReactComponents(instance);

    // First row is visible by default.
    expect(hierarchiesSelects.length).toBe(2);
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
            },{
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

    let {
      section0Textfields
    } = getReactComponents(instance);

    expect(section0Textfields.nodes[0].props.value).toBe('a');
    expect(section0Textfields.nodes[1].props.value).toBe('aa');
    expect(section0Textfields.nodes[2].props.value).toBe('');

    instance.find(HierarchiesEditor).node.removeHierarchy(0);

    ({ section0Textfields } = getReactComponents(instance));

    // First row is visible by default.
    expect(section0Textfields.length).toBe(2);

    expect(section0Textfields.nodes[0].props.value).toBe('aa');
    expect(section0Textfields.nodes[1].props.value).toBe('');
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

      const { delimiterTextfields } = getReactComponents(instance);
      delimiterTextfields.nodes[0].props.onChange('');

      expect(extensionBridge.validate()).toBe(false);
    });
  });
});
