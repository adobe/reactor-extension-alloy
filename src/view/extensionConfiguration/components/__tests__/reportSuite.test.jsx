import { mount } from 'enzyme';
import { DataElementSelectorButton } from '@reactor/react-components';

import React from 'react';
import ReportSuite from '../reportSuite';

const getReactComponents = (wrapper) => {
  const reportSuiteDataElementButton = wrapper.find(DataElementSelectorButton).node;

  return {
    reportSuiteDataElementButton
  };
};

describe('report suite', () => {
  let instance;
  let onChangeSpy = jasmine.createSpy('onChange');

  beforeAll(() => {
    instance = mount(<ReportSuite onChange={ onChangeSpy } />);
    window.extensionBridge = {
      openDataElementSelector: () => {}
    };
  });

  afterAll(() => {
    delete window.extensionBridge;
  });


  it('opens the data element selector from data element button', () => {
    const {
      reportSuiteDataElementButton
    } = getReactComponents(instance);

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    reportSuiteDataElementButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(onChangeSpy).toHaveBeenCalledWith(['%foo%']);
  });
});
