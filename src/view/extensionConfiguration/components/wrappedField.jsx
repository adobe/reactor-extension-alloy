import React from 'react';
import { Field } from 'redux-form';
import RadioGroup from '@react/react-spectrum/RadioGroup';
import Checkbox from '@react/react-spectrum/Checkbox';
import Textfield from '@react/react-spectrum/Textfield';
import ValidationWrapper from './validationWrapper';
import DataElementSelectorButton from './dataElementSelectorButton';

const addDataElementToken = (value, dataElementToken) => `${value || ''}${dataElementToken}`;

class DecoratedInput extends React.Component {
  openDataElementSelector(tokenize = false) {
    return () => {
      const {
        input: {
          onChange,
          value
        }
      } = this.props;

      // Whenever we're dealing with a data element token, we add it to whatever the existing value
      // is. If we're not dealing with a token, we replace the value entirely. This is just due
      // to how we want the UX to flow.
      window.extensionBridge.openDataElementSelector({
        tokenize
      }).then((dataElement) => {
        onChange(tokenize ? addDataElementToken(value, dataElement) : dataElement);
      });
    };
  }

  render() {
    const {
      fieldComponent: FieldComponent,
      className,
      componentClassName,
      input,
      meta,
      children,
      supportDataElement,
      supportDataElementName,
      errorTooltipPlacement,
      ...rest
    } = this.props;

    // Unlike other components, RadioGroup's "value" prop is named "selectedValue". :/
    if (FieldComponent === RadioGroup) {
      input.selectedValue = input.value;
    }

    const validation = {};
    if (meta.touched && meta.invalid) {
      validation.validationState = 'invalid';
      if (FieldComponent !== Textfield) {
        validation.validationState = 'invalid';
        validation.invalid = true;
      }
    }

    // This code that only sets className if it's truthy is just to get around
    // https://jira.corp.adobe.com/browse/RSP-269
    // https://jira.corp.adobe.com/browse/RSP-269
    // Once that's fixed, we should be able to always set the className prop.
    const validationWrapperProps = {
      error: meta.touched && meta.error,
      placement: errorTooltipPlacement
    };

    if (className) {
      validationWrapperProps.className = className;
    }

    return (
      <ValidationWrapper { ...validationWrapperProps }>
        <FieldComponent
          { ...input }
          { ...rest }
          meta={ meta }
          className={ componentClassName }
          { ...validation }
        >
          {children}
        </FieldComponent>
        {
          supportDataElement || supportDataElementName ?
            <DataElementSelectorButton
              onClick={ this.openDataElementSelector(supportDataElement) }
            /> : null
        }
      </ValidationWrapper>
    );
  }
}

export default ({ component: Component, ...rest }) => {
  const fieldProps = {
    component: DecoratedInput,
    fieldComponent: Component,
    ...rest
  };

  if (Component === Checkbox) {
    // redux-form uses this to determine whether it should set the "checked" prop
    // on the actual checkbox.
    fieldProps.type = 'checkbox';
  }
  return (
    <Field { ...fieldProps } />
  );
};
