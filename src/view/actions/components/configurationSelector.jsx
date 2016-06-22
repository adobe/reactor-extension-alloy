import React from 'react';
import { ValidationWrapper } from '@reactor/react-components';
import { connect } from 'react-redux';
import Alert from '@coralui/react-coral/lib/Alert';
import Radio from '@coralui/react-coral/lib/Radio';
import Select from '@coralui/react-coral/lib/Select';

var SELECTION_TYPES = {
  ALL: 'all',
  SUBSET: 'subset'
};

export class ConfigurationSelector extends React.Component {
  render() {
    const {
      availableExtensionConfigurations,
      fields: {
        extensionConfigurationSelectionType,
        extensionConfigurationIds
      }
    } = this.props;


    if (!availableExtensionConfigurations || !availableExtensionConfigurations.length) {
      return (
        <Alert variant="warning" className={this.props.className}>
          Setting variables will only take effect once you have configured the
          Adobe Analytics extension.
        </Alert>
      );
    } else if (availableExtensionConfigurations.length === 1) {
      return null;
    } else {
      const selectOptions = availableExtensionConfigurations.map(extensionConfiguration => {
        return {
          label: extensionConfiguration.name,
          value: extensionConfiguration.id
        };
      });

      return (
        <div className={this.props.className}>
          <h4 className="coral-Heading coral-Heading--4">
            Apply variables for the following extension configurations
          </h4>
          <div>
            <Radio
              {...extensionConfigurationSelectionType}
              value={SELECTION_TYPES.ALL}
              checked={extensionConfigurationSelectionType.value === SELECTION_TYPES.ALL}>
              All extension configurations
            </Radio>
          </div>
          <div>
            <Radio
              {...extensionConfigurationSelectionType}
              value={SELECTION_TYPES.SUBSET}
              checked={extensionConfigurationSelectionType.value === SELECTION_TYPES.SUBSET}>
              Specific extension configurations
            </Radio>
            {
              extensionConfigurationSelectionType.value === SELECTION_TYPES.SUBSET ?
                <div className="FieldSubset u-gapTop">
                  <ValidationWrapper
                    error={extensionConfigurationIds.touched && extensionConfigurationIds.error}>
                    <Select
                      {...extensionConfigurationIds}
                      onBlur={
                        () => extensionConfigurationIds.onBlur(extensionConfigurationIds.value)
                      }
                      placeholder="Select Configuration"
                      options={selectOptions}
                      multiple />
                  </ValidationWrapper>
                </div> : null
            }
          </div>
        </div>
      );
    }
  }
}

export const stateToProps = state => {
  return {
    availableExtensionConfigurations: state.extensionConfigurations || []
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
      extensionConfigurations: availableExtensionConfigurations,
      settings: {
        extensionConfigurationIds = []
      }
    } = options;

    extensionConfigurationIds = extensionConfigurationIds.filter(function(id) {
      return availableExtensionConfigurations.some(function(availableConfiguration) {
        return availableConfiguration.id === id;
      });
    });

    return {
      ...values,
      extensionConfigurationSelectionType: extensionConfigurationIds.length ?
        SELECTION_TYPES.SUBSET : SELECTION_TYPES.ALL,
      extensionConfigurationIds: extensionConfigurationIds
    };
  },
  formValuesToSettings(settings, values) {
    let {
      extensionConfigurationSelectionType,
      extensionConfigurationIds
    } = values;

    if (extensionConfigurationSelectionType === SELECTION_TYPES.SUBSET) {
      extensionConfigurationIds = extensionConfigurationIds.map((item) => item.value);

      settings = {
        ...settings,
        extensionConfigurationIds
      };
    }

    return settings;
  },
  validate(errors, values = {}) {
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
