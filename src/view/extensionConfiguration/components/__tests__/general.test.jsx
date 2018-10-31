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
import { Field } from 'redux-form';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Textfield from '@coralui/react-coral/lib/Textfield';
import ErrorTip from '@reactor/react-components/lib/errorTip';

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


  const trackingCookieNameField =
    wrapper.find(Field).filterWhere(
      n => n.prop('name') === 'trackingCookieName'
    );
  const trackingCookieNameTextfield = trackingCookieNameField.find(Textfield).node;
  const trackingCookieNameErrorTip = trackingCookieNameField.find(ErrorTip).node;

  return {
    euComplianceEnabledCheckbox,
    trackingServerTextfield,
    trackingServerSecureTextfield,
    trackingCookieNameTextfield,
    trackingCookieNameErrorTip
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
      company: {
        orgId: 'ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg'
      },
      settings: {
        trackingCookieName: 'somecookie',
        trackerProperties: {
          trackingServer: 'someserver',
          trackingServerSecure: 'somesecureserver'
        }
      }
    });

    const {
      trackingCookieNameTextfield,
      trackingServerTextfield,
      trackingServerSecureTextfield
    } = getReactComponents(instance);

    expect(trackingCookieNameTextfield.props.value).toBe('somecookie');
    expect(trackingServerTextfield.props.value).toBe('someserver');
    expect(trackingServerSecureTextfield.props.value).toBe('somesecureserver');
  });

  it('sets settings from form values', () => {
    extensionBridge.init({
      company: {
        orgId: 'ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg'
      }
    });

    const {
      euComplianceEnabledCheckbox,
      trackingServerTextfield,
      trackingServerSecureTextfield
    } = getReactComponents(instance);

    euComplianceEnabledCheckbox.props.onChange(true);
    const {
      trackingCookieNameTextfield
    } = getReactComponents(instance);

    trackingCookieNameTextfield.props.onChange('somecookie');
    trackingServerTextfield.props.onChange('someserver');
    trackingServerSecureTextfield.props.onChange('somesecureserver');

    const { trackingCookieName } = extensionBridge.getSettings();
    const {
      trackerProperties: {
        trackingServer,
        trackingServerSecure
      }
    } = extensionBridge.getSettings();

    expect(trackingCookieName).toBe('somecookie');
    expect(trackingServer).toBe('someserver');
    expect(trackingServerSecure).toBe('somesecureserver');
  });

  it('sets the default value of tracking cookie name to sat_track', () => {
    extensionBridge.init({
      company: {
        orgId: 'ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg'
      }
    });

    const { euComplianceEnabledCheckbox } = getReactComponents(instance);
    euComplianceEnabledCheckbox.props.onChange(true);

    const { trackingCookieNameTextfield } = getReactComponents(instance);
    expect(trackingCookieNameTextfield.props.value).toBe('sat_track');
  });

  it('sets error if the tracking cookie name url is not provided', () => {
    extensionBridge.init({
      company: {
        orgId: 'ABCDEFGHIJKLMNOPQRSTUVWX@AdobeOrg'
      }
    });

    const { euComplianceEnabledCheckbox } = getReactComponents(instance);
    euComplianceEnabledCheckbox.props.onChange(true);

    const { trackingCookieNameTextfield } = getReactComponents(instance);
    trackingCookieNameTextfield.props.onChange('');

    expect(extensionBridge.validate()).toBe(false);

    const { trackingCookieNameErrorTip } = getReactComponents(instance);

    expect(trackingCookieNameErrorTip).toBeDefined();
  });
});
