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

import React from 'react';
import { Accordion, AccordionItem } from '@react/react-spectrum/Accordion';
import { mergeConfigs } from '../utils/formConfigUtils';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './components/libraryManagement';
import General, { formConfig as generalFormConfig } from './components/general';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './components/linkTracking';
import Cookies, { formConfig as cookiesFormConfig } from './components/cookies';
import CustomSetup, { formConfig as customSetupFormConfig } from './components/customSetup';
import AudienceManager, { formConfig as audienceManagerFormConfig } from './components/audienceManager';
import eventBus from '../utils/eventBus';
import COMPONENT_NAMES from '../enums/componentNames';

const accordionIndexes = {
  [COMPONENT_NAMES.LIBRARY_MANAGEMENT]: 0,
  [COMPONENT_NAMES.GENERAL]: 1,
  [COMPONENT_NAMES.VARIABLES]: 2,
  [COMPONENT_NAMES.COOKIES]: 4,
  [COMPONENT_NAMES.AUDIENCE_MANAGER]: 5
};

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const getIndexesOfComponentsWithErrors = componentsWithErrors =>
  Object.keys(accordionIndexes).map(componentName => (
    componentsWithErrors.indexOf(componentName) !== -1 ? accordionIndexes[componentName] : null
  ));

export default class ExtensionConfiguration extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedIndexes: [0]
    };
  }

  componentDidMount() {
    eventBus.on('validationOccurred', this.validationOccurred, this);
  }

  componentWillUnmount() {
    eventBus.off('validationOccurred', this.validationOccurred);
  }

  onAccordionChange(newSelectedIndexes) {
    if (Array.isArray(newSelectedIndexes)) {
      this.setState({ selectedIndexes: newSelectedIndexes });
    }
  }

  validationOccurred() {
    const { componentsWithErrors } = this.props;
    let { selectedIndexes } = this.state;

    selectedIndexes = selectedIndexes
      .concat(getIndexesOfComponentsWithErrors(componentsWithErrors))
      .filter(onlyUnique);

    this.setState({
      selectedIndexes
    });
  }

  render() {
    const { selectedIndexes } = this.state;

    return (
      <div>
        <Accordion
          multiselectable
          variant="quiet"
          selectedIndex={ selectedIndexes }
          className="Accordion--first"
          onChange={ this.onAccordionChange.bind(this) }
        >
          <AccordionItem header="Library Management">
            <LibraryManagement />
          </AccordionItem>
          <AccordionItem header="General">
            <General />
          </AccordionItem>
          <AccordionItem header="Global Variables">
            <Variables showEvents={ false } />
          </AccordionItem>
          <AccordionItem header="Link Tracking">
            <LinkTracking />
          </AccordionItem>
          <AccordionItem header="Cookies">
            <Cookies />
          </AccordionItem>
          <AccordionItem header="Configure Tracker Using Custom Code">
            <CustomSetup />
          </AccordionItem>
          <AccordionItem header="Adobe Audience Manager">
            <AudienceManager />
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export const formConfig = mergeConfigs(
  libraryManagementFormConfig,
  generalFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig,
  cookiesFormConfig,
  customSetupFormConfig,
  audienceManagerFormConfig
);

