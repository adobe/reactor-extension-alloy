import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Tag from '@coralui/react-coral/lib/Tag';
import Radio from '@coralui/react-coral/lib/Radio';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';
import { Field } from 'redux-form';

import TagListEditor from './../tagListEditor';
import LibraryManagement, { formConfig } from '../libraryManagement';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const productionReportSuite = wrapper.find(TagListEditor)
    .filterWhere(n => n.prop('title').indexOf('Production') !== -1);
  const stagingReportSuite = wrapper.find(TagListEditor)
    .filterWhere(n => n.prop('title').indexOf('Staging') !== -1);
  const developmentReportSuite = wrapper.find(TagListEditor)
    .filterWhere(n => n.prop('title').indexOf('Development') !== -1);

  const productionReportSuites = productionReportSuite.find(Tag).nodes.map(n => n.props.children);
  const stagingReportSuites = stagingReportSuite.find(Tag).nodes.map(n => n.props.children);
  const developmentReportSuites = developmentReportSuite.find(Tag).nodes.map(n => n.props.children);

  const productionReportSuitesAddButton = productionReportSuite.find(Button)
    .filterWhere(n => n.prop('children') === 'Add').node;
  const stagingReportSuitesAddButton = stagingReportSuite.find(Button)
    .filterWhere(n => n.prop('children') === 'Add').node;
  const developmentReportSuitesAddButton = developmentReportSuite.find(Button)
    .filterWhere(n => n.prop('children') === 'Add').node;


  const productionReportSuiteTextfield = productionReportSuite.find(Textfield).node;
  const stagingReportSuiteTextfield = stagingReportSuite.find(Textfield).node;
  const developmentReportSuiteTextfield = developmentReportSuite.find(Textfield).node;

  const pageBottomLoadPhaseRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'pageBottom').node;
  const typePreinstalledRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'preinstalled').node;
  const typeRemoteRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'remote').node;
  const typeCustomRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  const trackerVariableNameTextfield = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('trackerVariableName') !== -1).find(Textfield).node;

  const httpUrlField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('httpUrl') !== -1);
  const httpUrlTextfield = httpUrlField.find(Textfield).node;
  const httpUrlErrorTip = httpUrlField.find(ErrorTip).node;

  const httpsUrlField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('httpsUrl') !== -1);
  const httpsUrlTextfield = httpsUrlField.find(Textfield).node;
  const httpsUrlErrorTip = httpsUrlField.find(ErrorTip).node;

  const showReportSuitesCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').indexOf('showReportSuites') !== -1).node;


  const sourceField = wrapper.find(Field).filterWhere(n => n.prop('name') === 'libraryCode.source');
  const openEditorButton = sourceField.find(Button).node;
  const sourceErrorTip = wrapper.find(ErrorTip).node;

  return {
    productionReportSuites,
    stagingReportSuites,
    developmentReportSuites,
    productionReportSuiteTextfield,
    stagingReportSuiteTextfield,
    developmentReportSuiteTextfield,
    productionReportSuitesAddButton,
    stagingReportSuitesAddButton,
    developmentReportSuitesAddButton,
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
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);
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
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      trackerVariableNameTextfield,
      showReportSuitesCheckbox
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);
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
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio,
      httpUrlTextfield,
      httpsUrlTextfield
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);

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
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      pageBottomLoadPhaseRadio,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
  });

  it('sets settings from managed form values', () => {
    extensionBridge.init();

    const {
      productionReportSuiteTextfield,
      productionReportSuitesAddButton,
      stagingReportSuiteTextfield,
      stagingReportSuitesAddButton,
      developmentReportSuiteTextfield,
      developmentReportSuitesAddButton,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuiteTextfield.props.onChange('aa');
    productionReportSuitesAddButton.props.onClick();
    productionReportSuiteTextfield.props.onChange('bb');
    productionReportSuitesAddButton.props.onClick();

    stagingReportSuiteTextfield.props.onChange('cc');
    stagingReportSuitesAddButton.props.onClick();
    stagingReportSuiteTextfield.props.onChange('dd');
    stagingReportSuitesAddButton.props.onClick();

    developmentReportSuiteTextfield.props.onChange('ee');
    developmentReportSuitesAddButton.props.onClick();
    developmentReportSuiteTextfield.props.onChange('ff');
    developmentReportSuitesAddButton.props.onClick();

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
      productionReportSuiteTextfield,
      productionReportSuitesAddButton,
      stagingReportSuiteTextfield,
      stagingReportSuitesAddButton,
      developmentReportSuiteTextfield,
      developmentReportSuitesAddButton,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    productionReportSuiteTextfield.props.onChange('aa');
    productionReportSuitesAddButton.props.onClick();
    productionReportSuiteTextfield.props.onChange('bb');
    productionReportSuitesAddButton.props.onClick();

    stagingReportSuiteTextfield.props.onChange('cc');
    stagingReportSuitesAddButton.props.onClick();
    stagingReportSuiteTextfield.props.onChange('dd');
    stagingReportSuitesAddButton.props.onClick();

    developmentReportSuiteTextfield.props.onChange('ee');
    developmentReportSuitesAddButton.props.onClick();
    developmentReportSuiteTextfield.props.onChange('ff');
    developmentReportSuitesAddButton.props.onClick();

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
      productionReportSuiteTextfield,
      productionReportSuitesAddButton,
      stagingReportSuiteTextfield,
      stagingReportSuitesAddButton,
      developmentReportSuiteTextfield,
      developmentReportSuitesAddButton,
      trackerVariableNameTextfield,
      httpUrlTextfield,
      httpsUrlTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuiteTextfield.props.onChange('aa');
    productionReportSuitesAddButton.props.onClick();
    productionReportSuiteTextfield.props.onChange('bb');
    productionReportSuitesAddButton.props.onClick();

    stagingReportSuiteTextfield.props.onChange('cc');
    stagingReportSuitesAddButton.props.onClick();
    stagingReportSuiteTextfield.props.onChange('dd');
    stagingReportSuitesAddButton.props.onClick();

    developmentReportSuiteTextfield.props.onChange('ee');
    developmentReportSuitesAddButton.props.onClick();
    developmentReportSuiteTextfield.props.onChange('ff');
    developmentReportSuitesAddButton.props.onClick();

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
      productionReportSuiteTextfield,
      productionReportSuitesAddButton,
      stagingReportSuiteTextfield,
      stagingReportSuitesAddButton,
      developmentReportSuiteTextfield,
      developmentReportSuitesAddButton,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuiteTextfield.props.onChange('aa');
    productionReportSuitesAddButton.props.onClick();
    productionReportSuiteTextfield.props.onChange('bb');
    productionReportSuitesAddButton.props.onClick();

    stagingReportSuiteTextfield.props.onChange('cc');
    stagingReportSuitesAddButton.props.onClick();
    stagingReportSuiteTextfield.props.onChange('dd');
    stagingReportSuitesAddButton.props.onClick();

    developmentReportSuiteTextfield.props.onChange('ee');
    developmentReportSuitesAddButton.props.onClick();
    developmentReportSuiteTextfield.props.onChange('ff');
    developmentReportSuitesAddButton.props.onClick();

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
