import React from 'react';
import Accordion from '@coralui/react-coral/lib/Accordion';
import AccordionItem from '@coralui/react-coral/lib/AccordionItem';
import { mergeConfigs } from '../utils/formConfigUtils';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './components/libraryManagement';
import General, { formConfig as generalFormConfig } from './components/general';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './components/linkTracking';
import Cookies, { formConfig as cookiesFormConfig } from './components/cookies';
import CustomSetup, { formConfig as customSetupFormConfig } from '../components/customSetup.jsx';

export default () => (
  <div>
    <Accordion
      multiselectable
      variant="quiet"
      defaultSelectedIndex="0"
      className="Accordion--first"
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
      <AccordionItem header="Customize Page Code">
        <CustomSetup />
      </AccordionItem>
    </Accordion>
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

