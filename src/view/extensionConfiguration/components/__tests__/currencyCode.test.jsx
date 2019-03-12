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
import Textfield from '@react/react-spectrum/Textfield';

import RestrictedComboBox from '../restrictedComboBox';
import CurrencyCode, { formConfig } from '../currencyCode';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const presetAutocomplete = wrapper.find(RestrictedComboBox);
  const customTextfield = wrapper.find(Textfield);
  const customInputMethodRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom');

  return {
    presetAutocomplete,
    customTextfield,
    customInputMethodRadio
  };
};

describe('currency code', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(CurrencyCode, formConfig, extensionBridge));
  });

  it('sets preset form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'EUR'
        }
      }
    });

    const { presetAutocomplete } = getReactComponents(instance);
    expect(presetAutocomplete.props().value).toBe('EUR');
  });

  it('sets custom form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          currencyCode: 'another non preset value'
        }
      }
    });

    const { customTextfield } = getReactComponents(instance);
    expect(customTextfield.props().value).toBe('another non preset value');
  });

  it('sets settings from preset form values', () => {
    extensionBridge.init();

    const { presetAutocomplete } = getReactComponents(instance);
    presetAutocomplete.props().onChange('EUR');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('EUR');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { customInputMethodRadio } = getReactComponents(instance);
    customInputMethodRadio.props().onChange(true, { stopPropagation: () => undefined });

    const { customTextfield } = getReactComponents(instance);
    customTextfield.props().onChange('some custom');

    const { currencyCode } = extensionBridge.getSettings().trackerProperties;
    expect(currencyCode).toBe('some custom');
  });
});
