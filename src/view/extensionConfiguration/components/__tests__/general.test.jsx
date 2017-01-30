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
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Textfield from '@coralui/react-coral/lib/Textfield';

import General, { formConfig } from '../general';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const euComplianceEnabledCheckbox = wrapper.find(Checkbox).node;
  const trackingServerTextfield =
    wrapper.find(Textfield).filterWhere(
      n => n.prop('name') === 'trackerProperties.trackingServer'
    ).node;
  const trackingServerSecureTextfield =
    wrapper.find(Textfield).filterWhere(
      n => n.prop('name') === 'trackerProperties.trackingServerSecure'
    ).node;

  return {
    euComplianceEnabledCheckbox,
    trackingServerTextfield,
    trackingServerSecureTextfield
  };
};

describe('general', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(General, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        euComplianceEnabled: true,
        trackerProperties: {
          trackingServer: 'someserver',
          trackingServerSecure: 'somesecureserver'
        }
      }
    });

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield
    } = getReactComponents(instance);

    expect(euComplianceEnabledCheckbox.props.value).toBe(true);
    expect(trackingServerTextfield.props.value).toBe('someserver');
    expect(trackingServerSecureTextfield.props.value).toBe('somesecureserver');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield
    } = getReactComponents(instance);

    euComplianceEnabledCheckbox.props.onChange(true);
    trackingServerTextfield.props.onChange('someserver');
    trackingServerSecureTextfield.props.onChange('somesecureserver');

    const { euComplianceEnabled } = extensionBridge.getSettings();
    const {
      trackerProperties: {
        trackingServer,
        trackingServerSecure
      }
    } = extensionBridge.getSettings();

    expect(euComplianceEnabled).toBe(true);
    expect(trackingServer).toBe('someserver');
    expect(trackingServerSecure).toBe('somesecureserver');
  });
});
