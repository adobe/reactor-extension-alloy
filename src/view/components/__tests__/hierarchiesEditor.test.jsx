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
                'd',
                'e'
              ],
              delimiter: ':'
            }
          ]
        }
      }
    });

    const {
      hierarchiesSelect0,
      delimiter0
    } = instance.refs;

    expect(hierarchiesSelect0.props.value).toBe('hier2');
    expect(delimiter0.props.value).toBe(':');
  });
});
