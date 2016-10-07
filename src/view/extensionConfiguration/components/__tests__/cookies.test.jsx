import { mount } from 'enzyme';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { Field } from 'redux-form';
import ErrorTip from '@reactor/react-components/lib/errorTip';

import Cookies, { formConfig } from '../cookies';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const cookieLifetimeSecondsField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').includes('cookieLifetimeSeconds'));
  const visitorIDTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('visitorID')).node;
  const visitorNamespaceTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('visitorNamespace')).node;
  const cookieDomainPeriodsTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('cookieDomainPeriods')).node;
  const fpcookieDomainPeriodsTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('fpCookieDomainPeriods')).node;
  const cookieLifetimeSelect =
    wrapper.find(Select).node;
  const cookieLifetimeSecondsTextfield = cookieLifetimeSecondsField.find(Textfield).node;
  const cookieLifetimeSecondsErrorTip = cookieLifetimeSecondsField.find(ErrorTip).node;

  return {
    visitorIDTextfield,
    visitorNamespaceTextfield,
    cookieDomainPeriodsTextfield,
    fpcookieDomainPeriodsTextfield,
    cookieLifetimeSelect,
    cookieLifetimeSecondsTextfield,
    cookieLifetimeSecondsErrorTip
  };
};

describe('cookies', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Cookies, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          visitorID: 'visitor id',
          visitorNamespace: 'visitor namespace',
          cookieDomainPeriods: 'cookie domain periods',
          fpCookieDomainPeriods: 'fp cookie domain periods',
          cookieLifetime: '10'
        }
      }
    });

    const {
      visitorIDTextfield,
      visitorNamespaceTextfield,
      cookieDomainPeriodsTextfield,
      fpcookieDomainPeriodsTextfield,
      cookieLifetimeSelect,
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);

    expect(visitorIDTextfield.props.value).toBe('visitor id');
    expect(visitorNamespaceTextfield.props.value).toBe('visitor namespace');
    expect(cookieDomainPeriodsTextfield.props.value).toBe('cookie domain periods');
    expect(fpcookieDomainPeriodsTextfield.props.value).toBe('fp cookie domain periods');
    expect(cookieLifetimeSelect.props.value).toBe('SECONDS');
    expect(cookieLifetimeSecondsTextfield.props.value).toBe('10');
  });

  it('sets SESSION cookie lifetime form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          cookieLifetime: 'SESSION'
        }
      }
    });

    const {
      cookieLifetimeSelect
    } = getReactComponents(instance);

    expect(cookieLifetimeSelect.props.value).toBe('SESSION');
  });

  it('sets NONE cookie lifetime form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          cookieLifetime: 'NONE'
        }
      }
    });

    const {
      cookieLifetimeSelect
    } = getReactComponents(instance);

    expect(cookieLifetimeSelect.props.value).toBe('NONE');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      visitorIDTextfield,
      visitorNamespaceTextfield,
      cookieDomainPeriodsTextfield,
      fpcookieDomainPeriodsTextfield,
      cookieLifetimeSelect
    } = getReactComponents(instance);

    visitorIDTextfield.props.onChange('visitor id');
    visitorNamespaceTextfield.props.onChange('visitor namespace');
    cookieDomainPeriodsTextfield.props.onChange('cookie domain periods');
    fpcookieDomainPeriodsTextfield.props.onChange('fp cookie domain periods');
    cookieLifetimeSelect.props.onChange({ value: 'SECONDS' });

    const { cookieLifetimeSecondsTextfield } = getReactComponents(instance);
    cookieLifetimeSecondsTextfield.props.onChange('11');

    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(visitorID).toBe('visitor id');
    expect(visitorNamespace).toBe('visitor namespace');
    expect(cookieDomainPeriods).toBe('cookie domain periods');
    expect(fpCookieDomainPeriods).toBe('fp cookie domain periods');
    expect(cookieLifetime).toBe('11');
  });

  it('sets SESSION cookie lifetime settings from form values', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);

    cookieLifetimeSelect.props.onChange({ value: 'SESSION' });

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('SESSION');
  });

  it('sets NONE cookie lifetime settings from form values', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);

    cookieLifetimeSelect.props.onChange({ value: 'NONE' });

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('NONE');
  });

  it('sets error if the number of seconds for cookie lifetime is not provided', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);
    cookieLifetimeSelect.props.onChange({ value: 'SECONDS' });

    const {
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);

    cookieLifetimeSecondsTextfield.props.onChange('  ');

    expect(extensionBridge.validate()).toBe(false);

    const {
      cookieLifetimeSecondsErrorTip
    } = getReactComponents(instance);

    expect(cookieLifetimeSecondsErrorTip).toBeDefined();
  });

  it('does not set settings for fields that are not completed', () => {
    extensionBridge.init();
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(visitorID).toBeUndefined();
    expect(visitorNamespace).toBeUndefined();
    expect(cookieDomainPeriods).toBeUndefined();
    expect(fpCookieDomainPeriods).toBeUndefined();
    expect(cookieLifetime).toBeUndefined();
  });

  it('shows an error when cookieLifetime seconds value is not provided', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);
    cookieLifetimeSelect.props.onChange({ value: 'SECONDS' });

    const {
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);

    cookieLifetimeSecondsTextfield.props.onChange('  ');

    extensionBridge.validate();

    const {
      cookieLifetimeSecondsErrorTip
    } = getReactComponents(instance);

    expect(cookieLifetimeSecondsErrorTip).toBeDefined();
  });
});
