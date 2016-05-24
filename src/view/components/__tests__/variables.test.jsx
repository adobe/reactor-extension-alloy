import extensionViewReduxForm from '../../extensionViewReduxForm';
import variables, { formConfig } from '../variables';
import { getFormInstance, createExtensionBridge } from '../../__tests__/helpers/formTestUtils';

describe('variables', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(variables);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          dynamicVariablePrefix: 'D=dynamicVariable_value',
          pageName: 'pageName_value',
          pageURL: 'pageURL_value',
          server: 'server_value',
          channel: 'channel_value',
          referrer: 'referrer_value',
          campaign: {
            type: 'campaign_type',
            value: 'campaign_value'
          },
          transactionID: 'transactionID_value',
          state: 'state_value',
          zip: 'zip_value'
        }
      }
    });

    const {
      dynamicVariablePrefixTextField,
      pageNameTextField,
      pageURLTextField,
      serverTextField,
      channelTextField,
      referrerTextField,
      campaignSelect,
      campaignTextField,
      transactionIDTextField,
      stateTextField,
      zipTextField
    } = instance.refs;

    expect(dynamicVariablePrefixTextField.props.value).toBe('D=dynamicVariable_value');
    expect(pageNameTextField.props.value).toBe('pageName_value');
    expect(pageURLTextField.props.value).toBe('pageURL_value');
    expect(serverTextField.props.value).toBe('server_value');
    expect(channelTextField.props.value).toBe('channel_value');
    expect(referrerTextField.props.value).toBe('referrer_value');
    expect(campaignSelect.props.value).toBe('campaign_type');
    expect(campaignTextField.props.value).toBe('campaign_value');
    expect(transactionIDTextField.props.value).toBe('transactionID_value');
    expect(stateTextField.props.value).toBe('state_value');
    expect(zipTextField.props.value).toBe('zip_value');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      dynamicVariablePrefixTextField,
      pageNameTextField,
      pageURLTextField,
      serverTextField,
      channelTextField,
      referrerTextField,
      campaignSelect,
      campaignTextField,
      transactionIDTextField,
      stateTextField,
      zipTextField
    } = instance.refs;

    dynamicVariablePrefixTextField.props.onChange('D=dynamicVariable_value');
    pageNameTextField.props.onChange('pageName_value');
    pageURLTextField.props.onChange('pageURL_value');
    serverTextField.props.onChange('server_value');
    channelTextField.props.onChange('channel_value');
    referrerTextField.props.onChange('referrer_value');
    campaignSelect.props.onChange('campaign_type');
    campaignTextField.props.onChange('campaign_value');
    transactionIDTextField.props.onChange('transactionID_value');
    stateTextField.props.onChange('state_value');
    zipTextField.props.onChange('zip_value');

    const {
      trackerProperties
    } = extensionBridge.getSettings();

    expect(trackerProperties.dynamicVariablePrefix).toBe('D=dynamicVariable_value');
    expect(trackerProperties.pageName).toBe('pageName_value');
    expect(trackerProperties.pageURL).toBe('pageURL_value');
    expect(trackerProperties.server).toBe('server_value');
    expect(trackerProperties.channel).toBe('channel_value');
    expect(trackerProperties.referrer).toBe('referrer_value');
    expect(trackerProperties.campaign).toEqual({type: 'campaign_type', value: 'campaign_value'});
    expect(trackerProperties.transactionID).toBe('transactionID_value');
    expect(trackerProperties.state).toBe('state_value');
    expect(trackerProperties.zip).toBe('zip_value');
  });
});
