import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';

import ReportSuite from './../reportSuite';
import LibraryManagement, { formConfig } from '../libraryManagement';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const [
    productionReportSuite,
    stagingReportSuite,
    developmentReportSuite
  ] = wrapper.find(ReportSuite).nodes;

  const pageBottomLoadPhaseRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'pageBottom').node;
  const typePreinstalledRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'preinstalled').node;
  const typeRemoteRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'remote').node;
  const typeCustomRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  const trackerVariableNameTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('trackerVariableName')).node;

  const httpUrlField = wrapper.find(Field).filterWhere(n => n.prop('name').includes('httpUrl'));
  const httpUrlTextfield = httpUrlField.find(Textfield).node;
  const httpUrlErrorTip = httpUrlField.find(ErrorTip).node;

  const httpsUrlField = wrapper.find(Field).filterWhere(n => n.prop('name').includes('httpsUrl'));
  const httpsUrlTextfield = httpsUrlField.find(Textfield).node;
  const httpsUrlErrorTip = httpsUrlField.find(ErrorTip).node;

  const showReportSuitesCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('showReportSuites')).node;


  const sourceField = wrapper.find(Field).filterWhere(n => n.prop('name') === 'libraryCode.source');
  const openEditorButton = sourceField.find(Button).node;
  const sourceErrorTip = wrapper.find(ErrorTip).node;

  return {
    productionReportSuite,
    stagingReportSuite,
    developmentReportSuite,
    pageBottomLoadPhaseRadio,
    trackerVariableNameTextfield,
    httpUrlTextfield,
    httpUrlErrorTip,
    httpsUrlTextfield,
    httpsUrlErrorTip,
    showReportSuitesCheckbox,
    typePreinstalledRadio,
    typeRemoteRadio,
    typeCustomRadio,
    openEditorButton,
    sourceErrorTip
  };
};

describe('libary management', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(LibraryManagement, formConfig, extensionBridge));
  });

  it('sets form values from managed type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'managed',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          loadPhase: 'pageBottom'
        }
      }
    });

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    expect(productionReportSuite.props.input.value).toEqual([{ value: 'aaa' }, { value: 'bbb' }]);
    expect(stagingReportSuite.props.input.value).toEqual([{ value: 'ccc' }, { value: 'ddd' }]);
    expect(developmentReportSuite.props.input.value).toEqual([{ value: 'eee' }, { value: 'fff' }]);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);
  });

  it('sets form values from already installed type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'preinstalled',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd'
        }
      }
    });

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      trackerVariableNameTextfield,
      showReportSuitesCheckbox
    } = getReactComponents(instance);

    expect(productionReportSuite.props.input.value).toEqual([{ value: 'aaa' }, { value: 'bbb' }]);
    expect(stagingReportSuite.props.input.value).toEqual([{ value: 'ccc' }, { value: 'ddd' }]);
    expect(developmentReportSuite.props.input.value).toEqual([{ value: 'eee' }, { value: 'fff' }]);
    expect(trackerVariableNameTextfield.props.value).toBe('d');
    expect(showReportSuitesCheckbox.props.value).toBe(true);
  });

  it('sets form values from remote type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'remote',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd',
          loadPhase: 'pageBottom',
          httpUrl: 'http://someurl.com',
          httpsUrl: 'http://somehttpsurl.com'
        }
      }
    });

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio,
      httpUrlTextfield,
      httpsUrlTextfield
    } = getReactComponents(instance);

    expect(productionReportSuite.props.input.value).toEqual([{ value: 'aaa' }, { value: 'bbb' }]);
    expect(stagingReportSuite.props.input.value).toEqual([{ value: 'ccc' }, { value: 'ddd' }]);
    expect(developmentReportSuite.props.input.value).toEqual([{ value: 'eee' }, { value: 'fff' }]);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
    expect(httpUrlTextfield.props.value).toBe('http://someurl.com');
    expect(httpsUrlTextfield.props.value).toBe('http://somehttpsurl.com');
  });

  it('sets form values from custom type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'custom',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd',
          loadPhase: 'pageBottom'
        }
      }
    });

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      pageBottomLoadPhaseRadio,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    expect(productionReportSuite.props.input.value).toEqual([{ value: 'aaa' }, { value: 'bbb' }]);
    expect(stagingReportSuite.props.input.value).toEqual([{ value: 'ccc' }, { value: 'ddd' }]);
    expect(developmentReportSuite.props.input.value).toEqual([{ value: 'eee' }, { value: 'fff' }]);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
  });

  it('sets settings from managed form values', () => {
    extensionBridge.init();

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuite.props.input.onChange([{ value: 'aa' }, { value: 'bb' }]);
    stagingReportSuite.props.input.onChange([{ value: 'cc' }, { value: 'dd' }]);
    developmentReportSuite.props.input.onChange([{ value: 'ee' }, { value: 'ff' }]);
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(loadPhase).toBe('pageBottom');
  });

  it('sets settings from already installed form values', () => {
    extensionBridge.init();

    const { typePreinstalledRadio } = getReactComponents(instance);
    typePreinstalledRadio.props.onChange('preinstalled');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    productionReportSuite.props.input.onChange([{ value: 'aa' }, { value: 'bb' }]);
    stagingReportSuite.props.input.onChange([{ value: 'cc' }, { value: 'dd' }]);
    developmentReportSuite.props.input.onChange([{ value: 'ee' }, { value: 'ff' }]);
    trackerVariableNameTextfield.props.onChange('d');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
  });

  it('sets settings from remote form values', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      trackerVariableNameTextfield,
      httpUrlTextfield,
      httpsUrlTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuite.props.input.onChange([{ value: 'aa' }, { value: 'bb' }]);
    stagingReportSuite.props.input.onChange([{ value: 'cc' }, { value: 'dd' }]);
    developmentReportSuite.props.input.onChange([{ value: 'ee' }, { value: 'ff' }]);
    trackerVariableNameTextfield.props.onChange('d');
    httpUrlTextfield.props.onChange('http://someurl.com');
    httpsUrlTextfield.props.onChange('https://someurl.com');
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName,
      httpUrl,
      httpsUrl,
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
    expect(httpUrl).toBe('http://someurl.com');
    expect(httpsUrl).toBe('https://someurl.com');
    expect(loadPhase).toBe('pageBottom');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props.onChange('custom');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuite,
      stagingReportSuite,
      developmentReportSuite,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuite.props.input.onChange([{ value: 'aa' }, { value: 'bb' }]);
    stagingReportSuite.props.input.onChange([{ value: 'cc' }, { value: 'dd' }]);
    developmentReportSuite.props.input.onChange([{ value: 'ee' }, { value: 'ff' }]);
    trackerVariableNameTextfield.props.onChange('d');
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName,
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
    expect(loadPhase).toBe('pageBottom');
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'custom',
          source: 'foo'
        }
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((source, callback) => {
        callback('bar');
      })
    };

    const { openEditorButton } = getReactComponents(instance);
    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);

    const settings = extensionBridge.getSettings();
    expect(settings.libraryCode.source).toEqual('bar');

    delete window.extensionBridge;
  });

  it('sets the http:// prefix if the http url  does not contain it', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpUrlTextfield } = getReactComponents(instance);
    httpUrlTextfield.props.onChange('someurl.com');

    const {
      httpUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpUrl).toBe('http://someurl.com');
  });

  it('sets the https:// prefix if the https url  does not contain it', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpsUrlTextfield } = getReactComponents(instance);
    httpsUrlTextfield.props.onChange('someurl.com');

    const {
      httpsUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpsUrl).toBe('https://someurl.com');
  });

  it('sets error if the http url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    expect(extensionBridge.validate()).toBe(false);

    const { httpUrlErrorTip } = getReactComponents(instance);

    expect(httpUrlErrorTip).toBeDefined();
  });

  it('sets error if the https url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    expect(extensionBridge.validate()).toBe(false);

    const { httpsUrlErrorTip } = getReactComponents(instance);

    expect(httpsUrlErrorTip).toBeDefined();
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props.onChange('custom');

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorTip } = getReactComponents(instance);
    expect(sourceErrorTip).toBeDefined();
  });
});
