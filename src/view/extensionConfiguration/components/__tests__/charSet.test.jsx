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
import Radio from '@react/react-spectrum/Radio';
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';

import CharSet, { formConfig } from '../charSet';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const presetSelect = wrapper.find(Select);
  const customTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').indexOf('charSet') !== -1);
  const customInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom');

  return {
    presetSelect,
    customTextfield,
    customInputMethodRadio
  };
};

describe('char set', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CharSet, formConfig, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'UTF-8'
        }
      }
    });

    const { presetSelect } = getReactComponents(instance);
    expect(presetSelect.props().value).toBe('UTF-8');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          charSet: 'another non preset value'
        }
      }
    });

    const { customTextfield } = getReactComponents(instance);
    expect(customTextfield.props().value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { presetSelect } = getReactComponents(instance);

    presetSelect.props().onChange('UTF-8');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('UTF-8');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customInputMethodRadio } = getReactComponents(instance);
    customInputMethodRadio.props().onChange(true, { stopPropagation: () => undefined });

    const { customTextfield } = getReactComponents(instance);
    customTextfield.props().onChange('some custom');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBe('some custom');
  });

  it('doesn\'t set the trackerSettings property when default value is selected', () => {
    extensionBridge.init();

    const { presetSelect } = getReactComponents(instance);

    presetSelect.props().onChange('ASCII');

    const { charSet } = extensionBridge.getSettings().trackerProperties;
    expect(charSet).toBeUndefined();
  });
});
