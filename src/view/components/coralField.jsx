import React from 'react';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import { Field as ReduxFormField } from 'redux-form';
import adaptReactCoral from '../adaptReactCoral';
import addDataElementToken from '../utils/addDataElementToken';

class InputWrapper extends React.Component {
  openDataElementSelector = () => {
    const {
      input: {
        onChange,
        value
      }
    } = this.props;

    window.extensionBridge.openDataElementSelector(dataElementName => {
      onChange(addDataElementToken(value, dataElementName));
    });
  };

  render() {
    const {
      input,
      meta,
      reactCoralComponent,
      supportValidation,
      supportDataElement,
      className,
      componentClassName,
      suffixLabel,
      ...rest
    } = this.props;

    const AdaptedReactCoralComponent = adaptReactCoral(reactCoralComponent);

    // I bet there's a way to cut down on the number of span wrappers.

    let result = (
      <span>
        <AdaptedReactCoralComponent
          className={ componentClassName }
          input={ input }
          meta={ meta }
          { ...rest }
        />
        {
          suffixLabel ? <span className="Label u-gapLeft">{ suffixLabel }</span> : null
        }
      </span>
    );

    if (supportDataElement) {
      result = (
        <span>
          { result }
          <DataElementSelectorButton onClick={ this.openDataElementSelector } />
        </span>
      );
    }

    if (supportValidation) {
      result = (
        <ValidationWrapper
          error={ meta.touched && meta.error }
        >
          { result }
        </ValidationWrapper>
      );
    }

    result = (
      <span className={ className }>
        { result }
      </span>
    );

    return result;
  }
}

const Field = ({ component, ...otherProps }) => {
  // Redux-form will only provide a "checked" property if you specify type="radio" or
  // type="checkbox". We'll do that automatically here so we don't have to remember to do it
  // every time we use radio or checkbox.
  // https://github.com/erikras/redux-form/issues/1445
  if (component.name === 'Radio' || component.name === 'Checkbox') {
    otherProps.type = component.name.toLowerCase();
  }

  return (
    <ReduxFormField
      reactCoralComponent={ component }
      component={ InputWrapper }
      { ...otherProps }
    />
  );
};

export default Field;
