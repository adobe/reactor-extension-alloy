/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2018 Adobe Systems Incorporated
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

import React from 'react';
import Textfield from '@react/react-spectrum/Textfield';
import Checkbox from '@react/react-spectrum/Checkbox';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import WrappedField from './wrappedField';
import InfoTip from './infoTip';
import COMPONENT_NAMES from '../../enums/componentNames';

const nameSpace = 'moduleProperties.audienceManager';

const AudienceManager = ({
  useAudienceManagerIntegration = false,
  useAdvancedAudienceManagerSettings = false }) =>
    <div>
      <section className="LinkTracking-section u-gapTop">
        <WrappedField
          name={ `${nameSpace}.useAudienceManagerIntegration` }
          component={ Checkbox }
        >
          Automatically share Analytics Data with Audience Manager
        </WrappedField>
        <InfoTip className="u-fieldLineHeight u-noPadding">
          Adds an Audience Management Module to Adobe Analytics that will share Analytics
          data with Audience Manager. This can be used instead of having the separate
          Audience Manager Data Integration Library (DIL) send data from the page.
        </InfoTip>
        { useAudienceManagerIntegration ?
          <div className="FieldSubset">
            <label className="ColumnGrid-cell">
              <span className="Label">Audience Manager Subdomain</span>
              <InfoTip className="u-fieldLineHeight">
                This is a name assigned to you by Adobe Audience Manager.
                It is sometimes referred to as your &quot;Partner Name&quot; or
                &quot;Partner Subdomain&quot;. Contact your Adobe consultant or
                Customer Care if you do not know your Partner Name.
              </InfoTip>
              <div>
                <WrappedField
                  name={ `${nameSpace}.config.partner` }
                  component={ Textfield }
                  inputClassName="Field--long"
                  supportDataElement
                />
              </div>
            </label>
            <div>
              <WrappedField
                name={ `${nameSpace}.useAdvancedAudienceManagerSettings` }
                component={ Checkbox }
              >
                Show advanced settings
              </WrappedField>
            </div>
            { useAdvancedAudienceManagerSettings ?
              <div>
                <div>
                  <label className="ColumnGrid-cell">
                    <span className="Label">Container NSID</span>
                    <InfoTip className="u-fieldLineHeight">
                      This property sets the container ID used by Audience Manager
                      for ID syncs. You would set this if you have deployed across
                      multiple sites. Each of these sites will have their own container
                      ID and ID syncs. When you have only one site, the container ID
                      is 0 by default and you do not need to set this property.
                    </InfoTip>
                    <div>
                      <WrappedField
                        name={ `${nameSpace}.config.containerNSID` }
                        type={ 'number' }
                        component={ Textfield }
                        inputClassName="Field--long"
                      />
                    </div>
                  </label>
                </div>
                <div>
                  <WrappedField
                    name={ `${nameSpace}.config.disableDestinationPublishingIframe` }
                    component={ Checkbox }
                  >
                    Do not attach the destination publishing IFRAME to the DOM or fire destinations
                  </WrappedField>
                  <InfoTip className="u-fieldLineHeight u-noPadding">
                    If true, will not attach the destination publishing IFRAME
                    to the DOM or fire destinations. Default is false.
                  </InfoTip>
                </div>
                <div>
                  <WrappedField
                    name={ `${nameSpace}.config.isCoopSafe` }
                    component={ Checkbox }
                  >
                    Data is safe for Adobe Experience Cloud Device Co-op
                  </WrappedField>
                  <InfoTip className="u-fieldLineHeight u-noPadding">
                    An optional, Boolean configuration that determines if DIL sends (or does not send) data to the Adobe Experience Cloud Device Co-op. <a target="_blank" rel="noopener noreferrer" href="https://marketing.adobe.com/resources/help/en_US/aam/dil-coopsafe.html">More details</a>. Default is false.
                  </InfoTip>
                </div>
                <div>
                  <label className="ColumnGrid-cell">
                    <span className="Label">Unique User ID Cookie</span>
                    <InfoTip className="u-fieldLineHeight">
                      This configuration lets you set an Adobe cookie in the
                      first-party domain with the Unique User ID (UUID) returned
                      from Audience Manager.
                    </InfoTip>
                    <div className="FieldSubset">
                      <span className="Label">Name</span>
                      <InfoTip className="u-fieldLineHeight">
                        The cookie name. Default is aam_uuid.
                      </InfoTip>
                      <div>
                        <WrappedField
                          name={ `${nameSpace}.config.uuidCookie.name` }
                          component={ Textfield }
                          inputClassName="Field--short"
                        />
                      </div>
                    </div>
                    <div className="FieldSubset">
                      <span className="Label">Days</span>
                      <InfoTip className="u-fieldLineHeight">

                        Cookie lifetime (100 days is default).
                      </InfoTip>
                      <div>
                        <WrappedField
                          name={ `${nameSpace}.config.uuidCookie.days` }
                          type={ 'number' }
                          component={ Textfield }
                          inputClassName="Field--short"
                        />
                      </div>
                    </div>
                    <div className="FieldSubset">
                      <span className="Label">Domain</span>
                      <InfoTip className="u-fieldLineHeight">
                        The domain the cookie is set in, e.g., &#39;adobe.com&#39;
                        (document.domain is default).
                      </InfoTip>
                      <div>
                        <WrappedField
                          name={ `${nameSpace}.config.uuidCookie.domain` }
                          component={ Textfield }
                          inputClassName="Field--short"
                        />
                      </div>
                    </div>
                    <div className="FieldSubset">
                      <span className="Label">Path</span>
                      <InfoTip className="u-fieldLineHeight">
                        Cookie path, e.g., &#39;/test&#39; (/ is default).
                      </InfoTip>
                      <div>
                        <WrappedField
                          name={ `${nameSpace}.config.uuidCookie.path` }
                          component={ Textfield }
                          inputClassName="Field--short"
                        />
                      </div>
                    </div>
                    <div className="FieldSubset">
                      <WrappedField
                        name={ `${nameSpace}.config.uuidCookie.secure` }
                        component={ Checkbox }
                      >
                        Secure
                      </WrappedField>
                      <InfoTip className="u-fieldLineHeight">
                        Sets a flag to send data over an HTTPS connection only.
                      </InfoTip>
                    </div>
                  </label>
                </div>
              </div> : null
            }
          </div> : null
        }
      </section>
    </div>;

export default connect(
  state => ({
    useAudienceManagerIntegration:
      formValueSelector('default')(state, `${nameSpace}.useAudienceManagerIntegration`),
    useAdvancedAudienceManagerSettings:
      formValueSelector('default')(state, `${nameSpace}.useAdvancedAudienceManagerSettings`)
  })
)(AudienceManager);

export const formConfig = {

  settingsToFormValues(values, settings) {
    // Extract already defined settings
    const {
      moduleProperties
    } = settings || {};
    const {
      audienceManager
    } = moduleProperties || {};
    const {
      config
    } = audienceManager || {};
    const {
      partner,
      containerNSID,
      disableDestinationPublishingIframe,
      isCoopSafe,
      uuidCookie
    } = config || {};
    const {
      name,
      days,
      domain,
      path,
      secure
    } = uuidCookie || {};
    const formAudienceManager = {
      useAudienceManagerIntegration: false,
      useAdvancedAudienceManagerSettings: false,
      config: {
        uuidCookie: {}
      }
    };
    if (moduleProperties && audienceManager && config) {
      formAudienceManager.useAudienceManagerIntegration = true;
      formAudienceManager.config.partner = partner;
      // Check if advanced settings should be enabled
      if (config && Object.keys(config).length > 1) {
        formAudienceManager.useAdvancedAudienceManagerSettings = true;
        formAudienceManager.config.containerNSID = containerNSID;
        formAudienceManager.config.disableDestinationPublishingIframe =
          disableDestinationPublishingIframe;
        formAudienceManager.config.isCoopSafe = isCoopSafe;
        if (moduleProperties.audienceManager.config.uuidCookie) {
          formAudienceManager.config.uuidCookie.name = name;
          formAudienceManager.config.uuidCookie.days = days;
          formAudienceManager.config.uuidCookie.domain = domain;
          formAudienceManager.config.uuidCookie.path = path;
          formAudienceManager.config.uuidCookie.secure = secure;
        }
      }
    }
    return {
      ...values,
      moduleProperties: {
        ...values.moduleProperties,
        audienceManager: formAudienceManager
      }
    };
  },

  formValuesToSettings(settings, values) {
    const aamValues = values.moduleProperties.audienceManager;
    if (!aamValues.useAudienceManagerIntegration) {
      return settings;
    }
    if (!aamValues.config.partner) {
      delete aamValues.config.partner;
    }
    if (!aamValues.config.containerNSID) {
      delete aamValues.config.containerNSID;
    } else {
      aamValues.config.containerNSID = Number(aamValues.config.containerNSID);
    }
    if (!aamValues.config.disableDestinationPublishingIframe) {
      // Default is false, so we can delete this
      delete aamValues.config.disableDestinationPublishingIframe;
    }
    if (!aamValues.config.isCoopSafe) {
      // Default is false, so we can delete this
      delete aamValues.config.isCoopSafe;
    }
    if (aamValues.config.uuidCookie) {
      if (!aamValues.config.uuidCookie.name) {
        delete aamValues.config.uuidCookie.name;
      }
      if (!aamValues.config.uuidCookie.days) {
        delete aamValues.config.uuidCookie.days;
      } else {
        aamValues.config.uuidCookie.days = Number(aamValues.config.uuidCookie.days);
      }
      if (!aamValues.config.uuidCookie.domain) {
        delete aamValues.config.uuidCookie.domain;
      }
      if (!aamValues.config.uuidCookie.path) {
        delete aamValues.config.uuidCookie.path;
      }
      if (!aamValues.config.uuidCookie.secure) {
        // Default is false, so we can delete this
        delete aamValues.config.uuidCookie.secure;
      }
    }
    const moduleProperties = {
      ...settings.moduleProperties,
      audienceManager: {
        config: {
          partner: aamValues.config.partner,
          containerNSID: aamValues.config.containerNSID,
          disableDestinationPublishingIframe:
            aamValues.config.disableDestinationPublishingIframe,
          isCoopSafe: aamValues.config.isCoopSafe
        }
      }
    };
    if (aamValues.config.uuidCookie &&
        Object.keys(aamValues.config.uuidCookie).length > 0) {
      moduleProperties.audienceManager.config.uuidCookie =
        aamValues.config.uuidCookie;
    }
    return {
      ...settings,
      moduleProperties
    };
  },

  validate(errors, values) {
    const componentsWithErrors = errors.componentsWithErrors ?
      errors.componentsWithErrors.slice() : [];
    let audienceManager = null;
    if (values.moduleProperties &&
        values.moduleProperties.audienceManager &&
        values.moduleProperties.audienceManager) {
      audienceManager = values.moduleProperties.audienceManager;
    }
    if (audienceManager &&
        audienceManager.useAudienceManagerIntegration &&
        (!audienceManager.config.partner ||
          audienceManager.config.partner.trim().length === 0)) {
      errors = {
        ...errors,
        moduleProperties: {
          ...errors.moduleProperties,
          audienceManager: {
            config: {
              partner: 'If sharing is enabled a subdomain is required'
            }
          }
        }
      };
    }
    if (errors.moduleProperties && errors.moduleProperties.audienceManager) {
      componentsWithErrors.push(COMPONENT_NAMES.AUDIENCE_MANAGER);
    }
    return {
      ...errors,
      componentsWithErrors
    };
  }
};
