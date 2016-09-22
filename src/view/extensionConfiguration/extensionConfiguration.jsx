import React from 'react';
import * as Coral from '@coralui/react-coral';
import { mergeConfigs } from '../utils/formConfigUtils';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './components/libraryManagement';
import General, { formConfig as generalFormConfig } from './components/general';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './components/linkTracking';
import Cookies, { formConfig as cookiesFormConfig } from './components/cookies';
import CustomSetup, { formConfig as customSetupFormConfig } from '../components/customSetup.jsx';

export default () => (
  <div>
    <Coral.Accordion
      multiselectable
      variant="quiet"
      defaultSelectedIndex="0"
      className="Accordion--first"
    >
      <Coral.AccordionItem header="Library Management">
        <LibraryManagement />
      </Coral.AccordionItem>
      <Coral.AccordionItem header="General">
        <General />
      </Coral.AccordionItem>
      <Coral.AccordionItem header="Global Variables">
        <Variables showEvents={ false } />
      </Coral.AccordionItem>
      <Coral.AccordionItem header="Link Tracking">
        <LinkTracking />
      </Coral.AccordionItem>
      <Coral.AccordionItem header="Cookies">
        <Cookies />
      </Coral.AccordionItem>
      <Coral.AccordionItem header="Customize Page Code">
        <CustomSetup />
      </Coral.AccordionItem>
    </Coral.Accordion>
  </div>
);

export const formConfig = mergeConfigs(
  libraryManagementFormConfig,
  generalFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig,
  cookiesFormConfig,
  customSetupFormConfig
);

