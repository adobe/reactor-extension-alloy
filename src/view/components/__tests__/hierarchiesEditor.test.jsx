import extensionViewReduxForm from '../../extensionViewReduxForm';
import hierarchiesEditor, { formConfig } from '../hierarchiesEditor';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('hierarchies editor', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(hierarchiesEditor);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
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
      hierarchiesSelect0,
      delimiter0,
      section00,
      section10,
      section20,
      section30
    } = instance.refs;

    expect(hierarchiesSelect0.props.value).toBe('hier2');
    expect(delimiter0.props.value).toBe(':');
    expect(section00.props.value).toBe('a');
    expect(section10.props.value).toBe('b');
    expect(section20.props.value).toBe('c');
    expect(section30.props.value).toBe('d');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      hierarchiesSelect0,
      delimiter0,
      section00,
      section10,
      section20,
      section30
    } = instance.refs;

    hierarchiesSelect0.props.onChange('hier3');
    delimiter0.props.onChange('-');
    section00.props.onChange('a');
    section10.props.onChange('b');
    section20.props.onChange('c');
    section30.props.onChange('d');

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

    const { addButton } = instance.refs;
    addButton.props.onClick();

    const {
      hierarchiesSelect0,
      hierarchiesSelect1,
      hierarchiesSelect2
    } = instance.refs;

    // First row is visible by default.
    expect(hierarchiesSelect0).toBeDefined();
    expect(hierarchiesSelect1).toBeDefined();
    expect(hierarchiesSelect2).toBeUndefined();
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

    let { section00, section01, section02 } = instance.refs;

    expect(section00.props.value).toBe('a');
    expect(section01.props.value).toBe('aa');
    expect(section02.props.value).toBe('');

    instance.removeHierarchy(0);

    ({ section00, section01, section02 } = instance.refs);

    // First row is visible by default.
    expect(section00).toBeDefined();
    expect(section01).toBeDefined();
    expect(section02).toBeUndefined();

    expect(section00.props.value).toBe('aa');
    expect(section01.props.value).toBe('');
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

      instance.refs.delimiter0.props.onChange('');

      expect(extensionBridge.validate()).toBe(false);
    });
  });
});
