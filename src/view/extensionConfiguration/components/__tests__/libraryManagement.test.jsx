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
import Checkbox from '@react/react-spectrum/Checkbox';
import Radio from '@react/react-spectrum/Radio';
import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';
import { FieldArray, Field } from 'redux-form';

import ReportSuitesEditor from '../reportSuitesEditor';
import LibraryManagement, { formConfig } from '../libraryManagement';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReportSuiteElements = (wrapper, fieldNameSuffix) => {
  const reportSuitesEditor = wrapper.find(FieldArray)
    .filterWhere(n => n.prop('name').indexOf(fieldNameSuffix) !== -1).find(ReportSuitesEditor);

  const rows = reportSuitesEditor
    .find('[data-row]')
    .map((row) => {
      const valueTextfield = row.find(Textfield);
      const removeButton = row.find(Button).last();
      return {
        valueTextfield,
        removeButton
      };
    });

  const addButton = reportSuitesEditor.find(Button)
    .filterWhere(n => n.prop('children') === 'Add Another');

  return {
    rows,
    addButton
  };
};

const getReactComponents = (wrapper) => {
  const productionReportSuites = getReportSuiteElements(wrapper, '.production');
  const stagingReportSuites = getReportSuiteElements(wrapper, '.staging');
  const developmentReportSuites = getReportSuiteElements(wrapper, '.development');

  const typePreinstalledRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'preinstalled');
  const typeRemoteRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'remote');
  const typeCustomRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom');

  const trackerVariableNameTextfield = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('trackerVariableName') !== -1).find(Textfield);

  const httpUrlField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('httpUrl') !== -1);
  const httpUrlTextfield = httpUrlField.find(Textfield);

  const httpsUrlField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('httpsUrl') !== -1);
  const httpsUrlTextfield = httpsUrlField.find(Textfield);

  const showReportSuitesCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').indexOf('showReportSuites') !== -1);


  const sourceField = wrapper.find(Field).filterWhere(n => n.prop('name') === 'libraryCode.source');
  const openEditorButton = sourceField.find(Button);

  return {
    productionReportSuites,
    stagingReportSuites,
    developmentReportSuites,
    trackerVariableNameTextfield,
    httpUrlTextfield,
    httpsUrlTextfield,
    showReportSuitesCheckbox,
    typePreinstalledRadio,
    typeRemoteRadio,
    typeCustomRadio,
    openEditorButton
  };
};

const populateReportSuiteFields = (instance) => {
  let {
    productionReportSuites,
    stagingReportSuites,
    developmentReportSuites
  } = getReactComponents(instance);

  productionReportSuites.addButton.props().onClick();
  stagingReportSuites.addButton.props().onClick();
  developmentReportSuites.addButton.props().onClick();
  developmentReportSuites.addButton.props().onClick();

  ({
    productionReportSuites,
    stagingReportSuites,
    developmentReportSuites
  } = getReactComponents(instance));

  productionReportSuites.rows[0].valueTextfield.props().onChange('aa');
  productionReportSuites.rows[1].valueTextfield.props().onChange('bb');

  stagingReportSuites.rows[0].valueTextfield.props().onChange('cc');
  stagingReportSuites.rows[1].valueTextfield.props().onChange('dd');

  developmentReportSuites.rows[0].valueTextfield.props().onChange('ee');
  developmentReportSuites.rows[1].valueTextfield.props().onChange('ff');
  developmentReportSuites.rows[2].valueTextfield.props().onChange('gg');

  // Test that removing a row functions properly.
  developmentReportSuites.rows[2].removeButton.props().onClick();
};

const getReportSuiteTextfieldValues = reportSuitesEditor => (
  reportSuitesEditor.rows.map(row => row.valueTextfield.props().value)
);

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
          }
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites
    } = getReactComponents(instance);


    expect(getReportSuiteTextfieldValues(productionReportSuites)).toEqual(['aaa', 'bbb']);
    expect(getReportSuiteTextfieldValues(stagingReportSuites)).toEqual(['ccc', 'ddd']);
    expect(getReportSuiteTextfieldValues(developmentReportSuites)).toEqual(['eee', 'fff']);
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

    expect(getReportSuiteTextfieldValues(productionReportSuites)).toEqual(['aaa', 'bbb']);
    expect(getReportSuiteTextfieldValues(stagingReportSuites)).toEqual(['ccc', 'ddd']);
    expect(getReportSuiteTextfieldValues(developmentReportSuites)).toEqual(['eee', 'fff']);
    expect(trackerVariableNameTextfield.props().value).toBe('d');
    expect(showReportSuitesCheckbox.props().value).toBe(true);
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
      httpUrlTextfield,
      httpsUrlTextfield
    } = getReactComponents(instance);

    expect(getReportSuiteTextfieldValues(productionReportSuites)).toEqual(['aaa', 'bbb']);
    expect(getReportSuiteTextfieldValues(stagingReportSuites)).toEqual(['ccc', 'ddd']);
    expect(getReportSuiteTextfieldValues(developmentReportSuites)).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props().value).toBe(true);

    expect(trackerVariableNameTextfield.props().value).toBe('d');
    expect(httpUrlTextfield.props().value).toBe('http://someurl.com');
    expect(httpsUrlTextfield.props().value).toBe('http://somehttpsurl.com');
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
          trackerVariableName: 'd'
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    expect(getReportSuiteTextfieldValues(productionReportSuites)).toEqual(['aaa', 'bbb']);
    expect(getReportSuiteTextfieldValues(stagingReportSuites)).toEqual(['ccc', 'ddd']);
    expect(getReportSuiteTextfieldValues(developmentReportSuites)).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props().value).toBe(true);

    expect(trackerVariableNameTextfield.props().value).toBe('d');
  });

  it('sets settings from managed form values', () => {
    extensionBridge.init();

    populateReportSuiteFields(instance);

    const {
      accounts: {
        production,
        staging,
        development
      }
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
  });

  it('sets settings from already installed form values', () => {
    extensionBridge.init();

    const { typePreinstalledRadio } = getReactComponents(instance);
    typePreinstalledRadio.props().onChange(true, { stopPropagation: () => undefined });

    const { showReportSuitesCheckbox, trackerVariableNameTextfield } = getReactComponents(instance);
    showReportSuitesCheckbox.props().onChange(true);
    trackerVariableNameTextfield.props().onChange('d');

    populateReportSuiteFields(instance);

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
    typeRemoteRadio.props().onChange(true, { stopPropagation: () => undefined });

    const {
      showReportSuitesCheckbox,
      trackerVariableNameTextfield,
      httpUrlTextfield,
      httpsUrlTextfield
    } = getReactComponents(instance);
    showReportSuitesCheckbox.props().onChange(true);
    trackerVariableNameTextfield.props().onChange('d');
    httpUrlTextfield.props().onChange('http://someurl.com');
    httpsUrlTextfield.props().onChange('https://someurl.com');

    populateReportSuiteFields(instance);

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName,
      httpUrl,
      httpsUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
    expect(httpUrl).toBe('http://someurl.com');
    expect(httpsUrl).toBe('https://someurl.com');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props().onChange(true, { stopPropagation: () => undefined });

    const {
      showReportSuitesCheckbox,
      trackerVariableNameTextfield
    } = getReactComponents(instance);
    showReportSuitesCheckbox.props().onChange(true);
    trackerVariableNameTextfield.props().onChange('d');

    populateReportSuiteFields(instance);

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
      openCodeEditor: jasmine.createSpy().and.callFake(() => {
        return {
          then(resolve) {
            resolve('bar');
          }
        };
      })
    };

    const { openEditorButton } = getReactComponents(instance);
    openEditorButton.props().onClick();

    expect(window.extensionBridge.openCodeEditor).toHaveBeenCalledWith({ code: 'foo' });
    expect(extensionBridge.validate()).toBe(true);

    const settings = extensionBridge.getSettings();
    expect(settings.libraryCode.source).toEqual('bar');

    delete window.extensionBridge;
  });

  it('sets error if the http url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props().onChange(true, { stopPropagation: () => undefined });

    expect(extensionBridge.validate()).toBe(false);

    const { httpUrlTextfield } = getReactComponents(instance);
    expect(httpUrlTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if the https url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props().onChange(true, { stopPropagation: () => undefined });

    expect(extensionBridge.validate()).toBe(false);

    const { httpsUrlTextfield } = getReactComponents(instance);
    expect(httpsUrlTextfield.props().validationState).toBe('invalid');
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props().onChange(true, { stopPropagation: () => undefined });

    expect(extensionBridge.validate()).toBe(false);

    const { openEditorButton } = getReactComponents(instance);
    expect(openEditorButton.props().invalid).toBeTrue();
  });
});
