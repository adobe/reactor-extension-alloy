import extensionViewReduxForm from '../../../extensionViewReduxForm';
import LibraryManagement, { formConfig } from '../libraryManagement';
import ReportSuite from '../reportSuite';
import Coral from '@coralui/coralui-support-reduxform';

import { getFormInstance, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';
import TestUtils from 'react-addons-test-utils';

const getReportSuiteComponents = (instance) => {
  const components = TestUtils.scryRenderedComponentsWithType(instance, ReportSuite);
  return {
    productionReportSuiteAutocomplete: components.filter((component) => {
      return component.props.refPrefix === 'production';
    })[0],
    stagingReportSuiteAutocomplete: components.filter((component) => {
      return component.props.refPrefix === 'staging';
    })[0],
    developmentReportSuiteAutocomplete: components.filter((component) => {
      return component.props.refPrefix === 'development';
    })[0]
  };
};

const getRadio = (instance, name, value) => {
  return TestUtils.scryRenderedComponentsWithType(instance, Coral.Radio).filter((component) => {
    return component.props.name === name && component.props.value === value;
  })[0];
};

const getTextfield = (instance, name) => {
  return TestUtils.scryRenderedComponentsWithType(instance, Coral.Textfield).filter((component) => {
    return component.props.name === name;
  })[0];
};

const getCheckbox = (instance, name) => {
  return TestUtils.scryRenderedComponentsWithType(instance, Coral.Checkbox).filter((component) => {
    return component.props.name === name;
  })[0];
};

describe('libary management', () => {
  let extensionBridge;
  let backupExtensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(LibraryManagement);
    extensionBridge = createExtensionBridge();
    instance = getFormInstance(FormComponent, extensionBridge);

    backupExtensionBridge = window.extensionBridge;
  });

  afterAll(() => {
    window.extensionBridge = backupExtensionBridge;
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
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);

    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');

    expect(productionReportSuiteAutocomplete.props.value).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuiteAutocomplete.props.value).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuiteAutocomplete.props.value).toEqual(['eee', 'fff']);
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
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);

    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');
    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');

    expect(productionReportSuiteAutocomplete.props.value).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuiteAutocomplete.props.value).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuiteAutocomplete.props.value).toEqual(['eee', 'fff']);
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
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);

    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');
    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');
    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');
    const httpUrlTextfield = getTextfield(instance, 'libraryCode.httpUrl');
    const httpsUrlTextfield = getTextfield(instance, 'libraryCode.httpsUrl');

    expect(productionReportSuiteAutocomplete.props.value).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuiteAutocomplete.props.value).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuiteAutocomplete.props.value).toEqual(['eee', 'fff']);

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
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);

    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');
    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');
    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');

    expect(productionReportSuiteAutocomplete.props.value).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuiteAutocomplete.props.value).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuiteAutocomplete.props.value).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
  });

  it('sets settings from managed form values', () => {
    extensionBridge.init();

    const {
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);

    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');

    productionReportSuiteAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuiteAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuiteAutocomplete.props.onChange(['ee', 'ff']);
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

    const typeRadio = getRadio(instance, 'libraryCode.type', 'preinstalled');
    typeRadio.props.onChange('preinstalled');

    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);
    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');

    productionReportSuiteAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuiteAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuiteAutocomplete.props.onChange(['ee', 'ff']);
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

    const typeRadio = getRadio(instance, 'libraryCode.type', 'remote');
    typeRadio.props.onChange('remote');

    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);
    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');
    const httpUrlTextfield = getTextfield(instance, 'libraryCode.httpUrl');
    const httpsUrlTextfield = getTextfield(instance, 'libraryCode.httpsUrl');
    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');


    productionReportSuiteAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuiteAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuiteAutocomplete.props.onChange(['ee', 'ff']);

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

    const typeRadio = getRadio(instance, 'libraryCode.type', 'custom');
    typeRadio.props.onChange('custom');

    const showReportSuitesCheckbox = getCheckbox(instance, 'libraryCode.showReportSuites');
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuiteAutocomplete,
      stagingReportSuiteAutocomplete,
      developmentReportSuiteAutocomplete
    } = getReportSuiteComponents(instance);
    const trackerVariableNameTextfield = getTextfield(instance, 'libraryCode.trackerVariableName');
    const pageBottomLoadPhaseRadio = getRadio(instance, 'libraryCode.loadPhase', 'pageBottom');


    productionReportSuiteAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuiteAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuiteAutocomplete.props.onChange(['ee', 'ff']);

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

  it('opens code editor with script value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'custom',
          script: 'foo'
        }
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((script, callback) => {
        callback('bar');
      })
    };

    const { openEditorButton } = instance.refs;
    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);

    const settings = extensionBridge.getSettings();
    expect(settings.libraryCode.script).toEqual('bar');

    delete window.extensionBridge;
  });

  it('sets the http:// prefix if the http url  does not contain it', () => {
    extensionBridge.init();

    const typeRadio = getRadio(instance, 'libraryCode.type', 'remote');
    typeRadio.props.onChange('remote');

    const httpUrlTextfield = getTextfield(instance, 'libraryCode.httpUrl');
    httpUrlTextfield.props.onChange('someurl.com');

    const {
      httpUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpUrl).toBe('http://someurl.com');
  });

  it('sets the https:// prefix if the https url  does not contain it', () => {
    extensionBridge.init();

    const typeRadio = getRadio(instance, 'libraryCode.type', 'remote');
    typeRadio.props.onChange('remote');

    const httpsUrlTextfield = getTextfield(instance, 'libraryCode.httpsUrl');
    httpsUrlTextfield.props.onChange('someurl.com');

    const {
      httpsUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpsUrl).toBe('https://someurl.com');
  });

  it('sets error if the http url is not provided', () => {
    extensionBridge.init();

    const typeRadio = getRadio(instance, 'libraryCode.type', 'remote');
    typeRadio.props.onChange('remote');

    const { httpUrlWrapper } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(httpUrlWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if the https url is not provided', () => {
    extensionBridge.init();

    const typeRadio = getRadio(instance, 'libraryCode.type', 'remote');
    typeRadio.props.onChange('remote');

    const { httpsUrlWrapper } = instance.refs;

    expect(extensionBridge.validate()).toBe(false);
    expect(httpsUrlWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if script is empty', () => {
    extensionBridge.init();

    const typeRadio = getRadio(instance, 'libraryCode.type', 'custom');
    typeRadio.props.onChange('custom');

    expect(extensionBridge.validate()).toBe(false);

    const { scriptErrorIcon } = instance.refs;

    expect(scriptErrorIcon.props.message).toBeDefined();
  });
});
