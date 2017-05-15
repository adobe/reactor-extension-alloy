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
import Radio from '@coralui/react-coral/lib/Radio';

import CustomSetup, { formConfig } from '../customSetup';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;
  const loadPhaseBeforeRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'beforeSettings').node;
  const loadPhaseAfterRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'afterSettings').node;

  return {
    openEditorButton,
    loadPhaseBeforeRadio,
    loadPhaseAfterRadio
  };
};

describe('customSetup', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = window.extensionBridge = createExtensionBridge();
    spyOn(extensionBridge, 'openCodeEditor').and.callFake((cb, options) => {
      cb(`${options.code} bar`);
    });
    instance = mount(bootstrap(CustomSetup, formConfig, extensionBridge));
  });

  afterAll(() => {
    delete window.extensionBridge;
  });

  it('radio buttons are not visible if code editor has not been used', () => {
    extensionBridge.init();

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio).toBeUndefined();
    expect(loadPhaseAfterRadio).toBeUndefined();
  });

  it('radio buttons are visible after code editor has been used', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio, loadPhaseAfterRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio).toBeDefined();
    expect(loadPhaseAfterRadio).toBeDefined();
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true',
          loadPhase: 'beforeSettings'
        }
      }
    });

    const { loadPhaseBeforeRadio } = getReactComponents(instance);
    expect(loadPhaseBeforeRadio.props.value).toBe('beforeSettings');
  });

  it('sets settings from form values', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'true'
        }
      }
    });

    const { loadPhaseBeforeRadio } = getReactComponents(instance);

    loadPhaseBeforeRadio.props.onChange('beforeSettings');

    const { customSetup } = extensionBridge.getSettings();
    expect(customSetup.loadPhase).toBe('beforeSettings');
  });

  it('allows user to provide custom code', () => {
    extensionBridge.init({
      settings: {
        customSetup: {
          source: 'foo'
        }
      }
    });

    const {
      openEditorButton
    } = getReactComponents(instance);

    openEditorButton.props.onClick();

    expect(extensionBridge.getSettings()).toEqual({
      customSetup: {
        source: 'foo bar'
      }
    });
  });
});
