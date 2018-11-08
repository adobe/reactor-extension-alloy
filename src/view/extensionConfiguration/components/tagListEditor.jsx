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

import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';
import { Tag, TagList } from '@react/react-spectrum/TagList';
import InfoTip from './infoTip';
import ErrorTip from './errorTip';
import WrappedField from './wrappedField';
import React from 'react';

import './tagListEditor.styl';

export default class TagListEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: ''
    };
  }

  onRemove = (removedValue) => {
    const {
      input: {
        value,
        onChange
      }
    } = this.props;

    onChange(value.filter(val => val !== removedValue));
  };

  onNewValueChange = (event) => {
    const newValue = event.target ? event.target.value : event;
    this.setState({
      newValue
    });
  };

  add = () => {
    const {
      input: {
        value,
        onChange
      }
    } = this.props;

    if (this.state.newValue) {
      const values = value ? value.slice() : [];
      if (!this.valueAlreadyExists(values, this.state.newValue)) {
        values.push(this.state.newValue);
        onChange(values);
      }

      this.setState({
        newValue: ''
      });
    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.add();
    }
  };

  openSelectorCallback = (dataElementToken) => {
    this.setState({
      newValue: `${this.state.newValue || ''}${dataElementToken}`
    });
    this.add();
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector().then(this.openSelectorCallback);
  };

  valueAlreadyExists = (values, newValue) => values.some(value => value === newValue);

  render() {
    const {
      title,
      tooltip,
      value,
      inputClassName,
      className,
      //figure out what meta is, where it's coming from and if it's needed
      meta: {
        touched,
        error
     }
    } = this.props;

    return (
      <div className={ `TagListEditor ${className}` }>
        <label className="Label">{ title }</label>
        {
          tooltip ? <InfoTip>{ tooltip }</InfoTip> : null
        }
        <div className="TagListEditor-inputControls">
          <Textfield
            className={ inputClassName || 'Field--long' }
            onChange={ this.onNewValueChange }
            onKeyPress={ this.handleKeyPress }
            value={ this.state.newValue }
          />
          {/*create a dataelementselectorbutton*/}
          {/*<DataElementSelectorButton onClick={ this.openSelector } />*/}
          <Button onClick={ this.add }>Save</Button>
          {/*create an error tip*/}
          { touched && error ? <ErrorTip>{ error }</ErrorTip> : null }
        </div>
        <div className="u-gapTop TagListEditor-tagContainer">
          <TagList
            onClose={ this.onRemove }
          >
            {
              value ? value.map(
                tag => <Tag className="TagListEditor-tag" key={ tag } title={ tag }>{ tag }</Tag>
              ) : null
            }
          </TagList>
        </div>
      </div>
    );
  }
}
