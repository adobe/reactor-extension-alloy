import React from 'react';
import ConfigurationSelector, { formConfig as configurationSelectorFormConfig } from '../components/configurationSelector';

export default () => (
  <div>
    <ConfigurationSelector
      className="u-gapBottom"
      heading="Clear tracker variables for each of the following extension configurations:"
    />
  </div>
);

export const formConfig = configurationSelectorFormConfig;
