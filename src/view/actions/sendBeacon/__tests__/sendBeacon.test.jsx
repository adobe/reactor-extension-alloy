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
import { DataElementSelectorButton } from '@reactor/react-components';
import Radio from '@react/react-spectrum/Radio';
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';

import SendBeacon, { formConfig } from '../sendBeacon';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const pageViewTypeRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'page').node;
  const linkTypeRadio = wrapper.find(Radio).filterWhere(n => n.prop('value') === 'link').node;
  const linkTypeSelect = wrapper.find(Select).filterWhere(n => n.prop('name') === 'linkType').node;
  const linkNameTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name') === 'linkName').node;
  const linkNameButton = wrapper.find(DataElementSelectorButton).node;

  return {
    pageViewTypeRadio,
    linkTypeRadio,
    linkTypeSelect,
    linkNameTextfield,
    linkNameButton
  };
};

describe('send beacon', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(SendBeacon, formConfig, extensionBridge));
  });

  it('sets page view form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'page'
      }
    });

    const { pageViewTypeRadio } = getReactComponents(instance);
    expect(pageViewTypeRadio.props.checked).toBe(true);
  });

  it('sets link form values from settings', () => {
    extensionBridge.init({
      settings: {
        type: 'link',
        linkType: 'd',
        linkName: 'some name'
      }
    });

    const {
      linkTypeRadio,
      linkTypeSelect,
      linkNameTextfield
    } = getReactComponents(instance);

    expect(linkTypeRadio.props.checked).toBe(true);
    expect(linkTypeSelect.props.value).toBe('d');
    expect(linkNameTextfield.props.value).toBe('some name');
  });

  it('sets page view settings from form values', () => {
    extensionBridge.init();

    const {
      pageViewTypeRadio,
      linkTypeRadio
    } = getReactComponents(instance);

    linkTypeRadio.props.onChange('link');
    pageViewTypeRadio.props.onChange('page');

    const {
      type
    } = extensionBridge.getSettings();

    expect(type).toBe('page');
  });

  it('sets link view settings from form values', () => {
    extensionBridge.init();

    const {
      linkTypeRadio
    } = getReactComponents(instance);

    linkTypeRadio.props.onChange('link');

    const { linkTypeSelect,
      linkNameTextfield
    } = getReactComponents(instance);

    linkTypeSelect.props.onChange({ value: 'e' });
    linkNameTextfield.props.onChange('some text');

    const {
      type,
      linkType,
      linkName
    } = extensionBridge.getSettings();

    expect(type).toBe('link');
    expect(linkType).toBe('e');
    expect(linkName).toBe('some text');
  });

  it('increment a page view radio is selected by default', () => {
    extensionBridge.init();

    const {
      pageViewTypeRadio
    } = getReactComponents(instance);

    const {
      type
    } = extensionBridge.getSettings();

    expect(pageViewTypeRadio.props.checked).toBe(true);
    expect(type).toBe('page');
  });
});
