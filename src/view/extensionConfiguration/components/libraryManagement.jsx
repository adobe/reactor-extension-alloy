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

import React, { Component } from 'react';
import Checkbox from '@react/react-spectrum/Checkbox';
import Radio from '@react/react-spectrum/Radio';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Textfield from '@react/react-spectrum/Textfield';
import Heading from '@react/react-spectrum/Heading';
import Select from '@react/react-spectrum/Select';
import { connect } from 'react-redux';
import { formValueSelector, FieldArray, change } from 'redux-form';
import memoize from 'memoize-one';

import EditorButton from './editorButton';
import WrappedField from './wrappedField';
import ReportSuiteEditor from './reportSuitesEditor';
import InfoTip from './infoTip';
import ENVIRONMENTS from '../../enums/environments';
import COMPONENT_NAMES from '../../enums/componentNames';
import analyticsApi from '../../utils/analyticsApi';

import './libraryManagement.styl';

const LIB_TYPES = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

const ReportSuites = ({ companies, getRsidCompletions }) => (

  <section>

    <Heading size="4">
      Report Suites
      <InfoTip>
        Specify one or more report suites to which your data should be sent.
      </InfoTip>
    </Heading>

    <section className="ReportSuites-fieldsContainer">
      { companies && (
        <div>
          <label className="Label">
            Company
            <InfoTip>
              The company chosen here is only used to pre-populate the list of available report
              suites on this page.
            </InfoTip>
          </label>
          <div>
            <WrappedField
              name="libraryCode.company"
              component={ Select }
              onBlur={ e => e.preventDefault() }
              options={ companies }
            />
          </div>
        </div>
      )}
      <div className="ReportSuites-environment">
        <label className="Label">
          Development Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            development environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.development"
            component={ ReportSuiteEditor }
            props={ { getRsidCompletions } }
          />
        </div>
      </div>
      <div className="ReportSuites-environment">
        <label className="Label">
          Staging Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            staging environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.staging"
            component={ ReportSuiteEditor }
            props={ { getRsidCompletions } }
          />
        </div>
      </div>
      <div className="ReportSuites-environment">
        <label className="Label">
          Production Report Suites
          <InfoTip>
            The report suite to which data should be sent when code is deployed on a
            production environment.
          </InfoTip>
        </label>
        <div>
          <FieldArray
            name="libraryCode.accounts.production"
            component={ ReportSuiteEditor }
            props={ { getRsidCompletions, companies } }
          />
        </div>
      </div>
    </section>
  </section>
);

const TrackerVariableName = ({ className }) => (
  <div className={ className }>
    <label>
      <span className="Label">Tracker is accessible on the global variable named: </span>
      <WrappedField
        name="libraryCode.trackerVariableName"
        component={ Textfield }
        componentClassName="u-gapLeft"
      />
    </label>
  </div>
);

let OverwriteReportSuites = ({ className, showReportSuites, getRsidCompletions, companies }) => (
  <div className={ className }>
    <WrappedField
      name="libraryCode.showReportSuites"
      component={ Checkbox }
    >
      Set the following report suites on tracker
    </WrappedField>

    {
      showReportSuites &&
      <ReportSuites
        getRsidCompletions={ getRsidCompletions }
        companies={ companies }
      />
    }
  </div>

);

OverwriteReportSuites = connect(
  state => ({
    showReportSuites: formValueSelector('default')(state, 'libraryCode.showReportSuites'),
    company: formValueSelector('default')(state, 'libraryCode.company')
  })
)(OverwriteReportSuites);

class LibraryManagement extends Component {
  constructor(props) {
    super(props);
    this.api = null;
    this.state = { companies: null };
    this.getRsidCompletionFunction = memoize((company) => {
      const getRsidCompletions = this.api.rsidCompletionFunction(company);
      getRsidCompletions('');
      return getRsidCompletions;
    });
  }

  componentDidMount() {
    const that = this;
    try {
      const {
        company,
        dispatch,
        meta: {
          tokens: {
            imsAccess: token
          },
          company: {
            orgId: imsOrgId
          }
        }
      } = this.props;

      this.api = analyticsApi(token);
      this.api.companies(imsOrgId).then((companies) => {
        if (companies.length === 1) {
          dispatch(change('default', 'libraryCode.company', companies[0].value));
          that.setState({ companies: null });
        } else if (companies.length === 0) {
          dispatch(change('default', 'libraryCode.company', null));
          that.setState({ companies: null });
        } else {
          if (!company) {
            dispatch(change('default', 'libraryCode.company', companies[0].value));
          }
          that.setState({ companies });
        }
      });
    } catch (e) {
      // could not get the companies
    }
  }

  render() {
    const { type, company } = this.props;
    const { companies } = this.state;
    let getRsidCompletions = null;
    if (this.api && company) {
      getRsidCompletions = this.getRsidCompletionFunction(company);
    }
    return (
      <div>
        <div>
          <WrappedField
            vertical
            name="libraryCode.type"
            component={ RadioGroup }
          >
            <Radio
              value={ LIB_TYPES.MANAGED }
              label="Manage the library for me"
            />
          </WrappedField>
          {
            type === LIB_TYPES.MANAGED ?
              <div className="FieldSubset">
                <ReportSuites getRsidCompletions={ getRsidCompletions } companies={ companies } />
                <WrappedField
                  name="libraryCode.scopeTrackerGlobally"
                  component={ Checkbox }
                >
                  Make tracker globally accessible
                </WrappedField>
                <InfoTip className="u-fieldLineHeight u-noPadding">
                  If enabled the tracker will be scoped globally under <strong>window.s</strong>.
                </InfoTip>
              </div> : null
          }
        </div>
        <div>
          <WrappedField
            vertical
            name="libraryCode.type"
            component={ RadioGroup }
          >
            <Radio
              value={ LIB_TYPES.PREINSTALLED }
              label="Use the library already installed on the page"
            />
          </WrappedField>
          {
            type === LIB_TYPES.PREINSTALLED ?
              <div className="FieldSubset">
                <OverwriteReportSuites
                  className="u-gapBottom"
                  getRsidCompletions={ getRsidCompletions }
                  companies={ companies }
                />
                <TrackerVariableName />
              </div> : null
          }
        </div>
        <div>
          <WrappedField
            vertical
            name="libraryCode.type"
            component={ RadioGroup }
          >
            <Radio
              value={ LIB_TYPES.REMOTE }
              label="Load the library from a custom URL"
            />
          </WrappedField>
          {
            type === LIB_TYPES.REMOTE ?
              <div className="FieldSubset">
                <div className="u-gapBottom">
                  <label>
                    <span className="Label">HTTP URL:</span>
                    <div>
                      <WrappedField
                        name="libraryCode.httpUrl"
                        component={ Textfield }
                        componentClassName="Field--long"
                        supportDataElement
                      />
                    </div>
                  </label>
                  <label>
                    <span className="Label u-gapTop">HTTPS URL:</span>
                    <div>
                      <WrappedField
                        name="libraryCode.httpsUrl"
                        component={ Textfield }
                        componentClassName="Field--long"
                        supportDataElement
                      />
                    </div>
                  </label>
                </div>
                <OverwriteReportSuites
                  className="u-block u-gapBottom"
                  getRsidCompletions={ getRsidCompletions }
                  companies={ companies }
                />
                <TrackerVariableName className="u-block u-gapBottom" />
              </div> : null
          }
        </div>
        <div>
          <WrappedField
            vertical
            name="libraryCode.type"
            component={ RadioGroup }
          >
            <Radio
              component={ Radio }
              value={ LIB_TYPES.CUSTOM }
            >
              Let me provide custom library code
            </Radio>
          </WrappedField>
          {
            type === LIB_TYPES.CUSTOM ?
              <div className="FieldSubset">
                <div className="u-gapBottom">
                  <WrappedField
                    name="libraryCode.source"
                    component={ EditorButton }
                  />
                </div>
                <OverwriteReportSuites
                  className="u-block u-gapBottom"
                  getRsidCompletions={ getRsidCompletions }
                  companies={ companies }
                />
                <TrackerVariableName className="u-block u-gapBottom" />
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    type: formValueSelector('default')(state, 'libraryCode.type'),
    company: formValueSelector('default')(state, 'libraryCode.company'),
    meta: state.meta
  })
)(LibraryManagement);

export const formConfig = {
  settingsToFormValues(values, settings) {
    const libraryCode = settings.libraryCode || {};

    const {
      type,
      company,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source,
      scopeTrackerGlobally
    } = libraryCode;

    const showReportSuites = Boolean(type !== LIB_TYPES.MANAGED && libraryCode.accounts);

    const accounts = libraryCode.accounts || {};
    accounts.production = accounts.production || [''];
    accounts.staging = accounts.staging || [''];
    accounts.development = accounts.development || [''];

    return {
      ...values,
      libraryCode: {
        type: type || LIB_TYPES.MANAGED,
        company,
        trackerVariableName: trackerVariableName || 's',
        accounts,
        showReportSuites,
        httpUrl,
        httpsUrl,
        source,
        scopeTrackerGlobally
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      type,
      company,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source,
      showReportSuites,
      scopeTrackerGlobally
    } = values.libraryCode || {};

    const libraryCodeSettings = {
      type
    };

    if (company) {
      libraryCodeSettings.company = company;
    }

    const exportReportSuites = showReportSuites || type === LIB_TYPES.MANAGED;
    if (exportReportSuites && values.libraryCode.accounts) {
      const accounts = {};

      ENVIRONMENTS.forEach((environment) => {
        const accountsForEnvironment = values.libraryCode.accounts[environment]
          .filter(account => account);

        if (accountsForEnvironment.length > 0) {
          accounts[environment] = accountsForEnvironment;
        }
      });

      if (Object.keys(accounts).length) {
        libraryCodeSettings.accounts = accounts;
      }
    }
    if (type === LIB_TYPES.MANAGED) {
      libraryCodeSettings.scopeTrackerGlobally = (scopeTrackerGlobally === true);
    } else {
      libraryCodeSettings.trackerVariableName = trackerVariableName;
    }

    if (type === LIB_TYPES.REMOTE) {
      libraryCodeSettings.httpUrl = httpUrl;
      libraryCodeSettings.httpsUrl = httpsUrl;
    }

    if (type === LIB_TYPES.CUSTOM) {
      libraryCodeSettings.source = source;
    }

    return {
      ...settings,
      libraryCode: libraryCodeSettings
    };
  },
  validate(errors, values) {
    const {
      accounts = {},
      showReportSuites,
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      source
    } = values.libraryCode || {};

    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];

    const libraryCodeErrors = {};

    const reportSuitesAreRequired =
      (type !== LIB_TYPES.MANAGED && showReportSuites) || type === LIB_TYPES.MANAGED;
    const productionAccountsAreMissing = !accounts.production ||
      accounts.production.filter(account => account).length === 0;
    if (reportSuitesAreRequired && productionAccountsAreMissing) {
      libraryCodeErrors.accounts = {
        production: ['Please specify a production report suite']
      };
    }

    if (type !== LIB_TYPES.MANAGED && !trackerVariableName) {
      libraryCodeErrors.trackerVariableName = 'Please specify a variable name';
    }

    if (type === LIB_TYPES.REMOTE) {
      if (!httpUrl) {
        libraryCodeErrors.httpUrl = 'Please specify an HTTP URL';
      }

      if (!httpsUrl) {
        libraryCodeErrors.httpsUrl = 'Please specify an HTTPS URL';
      }
    }

    if (type === LIB_TYPES.CUSTOM && !source) {
      libraryCodeErrors.source = 'Please provide custom code';
    }

    if (Object.keys(libraryCodeErrors).length) {
      componentsWithErrors.push(COMPONENT_NAMES.LIBRARY_MANAGEMENT);
    }

    return {
      ...errors,
      componentsWithErrors,
      libraryCode: libraryCodeErrors
    };
  }
};
