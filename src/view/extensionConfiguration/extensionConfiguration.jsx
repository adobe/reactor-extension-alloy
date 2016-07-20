import React from 'react';
import * as Coral from '@coralui/react-coral';
import extensionViewReduxForm from '../extensionViewReduxForm';
import mergeFormConfigs from '../utils/mergeFormConfigs';
import LibraryManagement, { formConfig as libraryManagementFormConfig } from './components/libraryManagement';
import General, { formConfig as generalFormConfig } from './components/general';
import Variables, { formConfig as variablesFormConfig } from '../components/variables';
import LinkTracking, { formConfig as linkTrackingFormConfig } from './components/linkTracking';
import Cookies, { formConfig as cookiesFormConfig } from './components/cookies';
import CustomSetup, { formConfig as customSetupFormConfig } from '../components/customSetup.jsx';

export function ExtensionConfiguration({ ...props }) {
  return (
    <div>
      <Coral.Accordion
        multiselectable
        variant="quiet"
        defaultSelectedKey="0"
        className="Accordion--first"
      >
        <Coral.AccordionItem header="Library Management">
          <LibraryManagement fields={ props.fields } />
        </Coral.AccordionItem>
        <Coral.AccordionItem header="General">
          <General fields={ props.fields } />
        </Coral.AccordionItem>
        <Coral.AccordionItem header="Global Variables">
          <Variables fields={ props.fields } showEvents={ false } />
        </Coral.AccordionItem>
        <Coral.AccordionItem header="Link Tracking">
          <LinkTracking fields={ props.fields } />
        </Coral.AccordionItem>
        <Coral.AccordionItem header="Cookies">
          <Cookies fields={ props.fields } />
        </Coral.AccordionItem>
        <Coral.AccordionItem header="Customize Page Code">
          <CustomSetup fields={ props.fields } />
        </Coral.AccordionItem>
      </Coral.Accordion>
    </div>
  );
}

export const formConfig = mergeFormConfigs(
  libraryManagementFormConfig,
  generalFormConfig,
  variablesFormConfig,
  linkTrackingFormConfig,
  cookiesFormConfig,
  customSetupFormConfig
);

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);

