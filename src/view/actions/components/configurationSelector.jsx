import React from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import Alert from '@coralui/react-coral/lib/Alert';
import Radio from '@coralui/redux-form-react-coral/lib/Radio';
import Select from '@coralui/redux-form-react-coral/lib/Select';
import Heading from '@coralui/react-coral/lib/Heading';

const SELECTION_TYPES = {
  ALL: 'all',
  SUBSET: 'subset'
};

export class ConfigurationSelector extends React.Component {
  render() {
    const {
      availableExtensionConfigurations,
      extensionConfigurationSelectionType
    } = this.props;


    if (!availableExtensionConfigurations || !availableExtensionConfigurations.length) {
      return (
        <Alert variant="warning" className={ this.props.className }>
          This feature will only take effect once you have created an extension configuration.
        </Alert>
      );
    } else if (availableExtensionConfigurations.length === 1) {
      return null;
    }

    const selectOptions = availableExtensionConfigurations.map(extensionConfiguration => ({
      label: extensionConfiguration.name,
      value: extensionConfiguration.id
    }));

    return (
      <div className={ this.props.className }>
        { this.props.heading ? <Heading size="4">{ this.props.heading }</Heading> : null }
        <div>
          <Field
            name="extensionConfigurationSelectionType"
            component={ Radio }
            type="radio"
            value={ SELECTION_TYPES.ALL }
          >
            All extension configurations
          </Field>
        </div>
        <div>
          <Field
            name="extensionConfigurationSelectionType"
            component={ Radio }
            type="radio"
            value={ SELECTION_TYPES.SUBSET }
          >
            Specific extension configurations
          </Field>

          {
            extensionConfigurationSelectionType === SELECTION_TYPES.SUBSET ?
              <div className="FieldSubset u-gapTop">
                <Field
                  name="extensionConfigurationIds"
                  component={ DecoratedInput }
                  inputComponent={ Select }
                  placeholder="Select Configuration"
                  options={ selectOptions }
                  multiple
                />
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export const stateToProps = state => ({
  availableExtensionConfigurations: state.meta.extensionConfigurations || [],
  extensionConfigurationSelectionType:
    formValueSelector('default')(state, 'extensionConfigurationSelectionType')
});

export default connect(stateToProps)(ConfigurationSelector);

export const formConfig = {
  settingsToFormValues(values, settings, meta) {
    const availableExtensionConfigurations = meta.extensionConfigurations || [];
    const extensionConfigurationIds = (settings.extensionConfigurationIds || []).filter(
      id => availableExtensionConfigurations.some(
        availableConfiguration => availableConfiguration.id === id
      )
    );

    return {
      ...values,
      extensionConfigurationSelectionType: extensionConfigurationIds.length ?
        SELECTION_TYPES.SUBSET : SELECTION_TYPES.ALL,
      extensionConfigurationIds
    };
  },
  formValuesToSettings(settings, values) {
    const { extensionConfigurationSelectionType, extensionConfigurationIds } = values;

    if (extensionConfigurationSelectionType === SELECTION_TYPES.SUBSET) {
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
