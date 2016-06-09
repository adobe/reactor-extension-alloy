import React from 'react';
import ReactDom from 'react-dom';
import ReportSuite from '../reportSuite';
import TestUtils from 'react-addons-test-utils';

describe('report suite', () => {
  let instance;

  beforeAll(() => {
    instance =  TestUtils.renderIntoDocument(
      <ReportSuite refPrefix="some" />
    );
  });

  it('opens the data element selector from data element button', () => {
    const { someReportSuiteAutocomplete, someReportSuiteButton } = instance.refs;

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    someReportSuiteButton.props.onClick();

    const autoCompleteDomNode = ReactDom.findDOMNode(someReportSuiteAutocomplete);
    const autoCompleteInput = autoCompleteDomNode.querySelector('.coral-Autocomplete-input');

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(autoCompleteInput.value).toBe('%foo%');
  });
});
