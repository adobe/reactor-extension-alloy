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

import CustomSetup, { formConfig } from '../customSetup';
import createExtensionBridge from '../../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../../bootstrap';

const getReactComponents = (wrapper) => {
  const openEditorButton = wrapper.find(Button).node;

  return {
    openEditorButton
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
