import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper } from '@reactor/react-components';
import { connect } from 'react-redux';

var SELECTION_TYPES = {
  ALL: 'all',
  SUBSET: 'subset'
};

class ConfigurationSelector extends React.Component {
  render() {
    const {
      extensionConfigurationSelectionType,
      extensionConfigurationIds
    } = this.props.fields;

    const selectOptions = this.props.extensionConfigurations.map(extensionConfiguration => {
      return (
        <Coral.Select.Item key={extensionConfiguration.id} value={extensionConfiguration.id}>
          {extensionConfiguration.name}
        </Coral.Select.Item>
      );
    });

    return (
      <div>
        <h4 className="coral-Heading coral-Heading--4">
          Apply variables for the following extension configurations
        </h4>
        <div>
          <Coral.Radio
            {...extensionConfigurationSelectionType}
            value={SELECTION_TYPES.ALL}
            checked={extensionConfigurationSelectionType.value === SELECTION_TYPES.ALL}>
            All extension configurations
          </Coral.Radio>
        </div>
        <div>
          <Coral.Radio
            {...extensionConfigurationSelectionType}
            value={SELECTION_TYPES.SUBSET}
            checked={extensionConfigurationSelectionType.value === SELECTION_TYPES.SUBSET}>
            Specific extension configurations
          </Coral.Radio>
          {
            extensionConfigurationSelectionType.value === SELECTION_TYPES.SUBSET ?
              <div className="FieldSubset u-gapTop">
                <ValidationWrapper
                  error={extensionConfigurationIds.touched && extensionConfigurationIds.error}>
                  <Coral.Select
                    {...extensionConfigurationIds}
                    placeholder="Select Configuration"
                    multiple>
                    {selectOptions}
                  </Coral.Select>
                </ValidationWrapper>
              </div> : null
          }
        </div>
      </div>
    );
  }
}

const stateToProps = state => {
  return {
    extensionConfigurations: state.extensionConfigurations || []
  };
};

export default connect(stateToProps)(ConfigurationSelector);

export const formConfig = {
  fields: [
    'extensionConfigurationSelectionType',
    'extensionConfigurationIds'
  ],
  settingsToFormValues(values, options) {
    let {
      extensionConfigurationIds
    } = options.settings;

    return {
      ...values,
      extensionConfigurationSelectionType: extensionConfigurationIds ?
        SELECTION_TYPES.SUBSET : SELECTION_TYPES.ALL,
      extensionConfigurationIds: extensionConfigurationIds || []
    };
  },
  formValuesToSettings(settings, values) {
    let {
      extensionConfigurationSelectionType,
      extensionConfigurationIds
    } = values;

    if (extensionConfigurationSelectionType === SELECTION_TYPES.SUBSET) {
      settings = {
        ...settings,
        extensionConfigurationIds
      };
    }

    return settings;
  },
  validate(errors, values) {
    const {
      extensionConfigurationSelectionType,
      extensionConfigurationIds
    } = values;

    if (extensionConfigurationSelectionType === SELECTION_TYPES.SUBSET &&
      !extensionConfigurationIds.length) {

      errors = {
        ...errors,
        extensionConfigurationIds: 'Please select at least one configuration'
      };
    }

    return errors;
  }
};
