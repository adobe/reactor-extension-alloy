import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import Tag from '@coralui/react-coral/lib/Tag';
import TagList from '@coralui/react-coral/lib/TagList';

import { DataElementSelectorButton, InfoTip } from '@reactor/react-components';
import React from 'react';
import addDataElementToken from '../../utils/addDataElementToken';

export default class TagListEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: ''
    };
  }

  onRemove = (removedValue) => {
    this.props.onChange(this.props.value.filter((value) => value !== removedValue));
  };

  onNewValueChange = event => {
    const newValue = event.target ? event.target.value : event;
    this.setState({
      newValue
    });
  };

  add = () => {
    if (this.state.newValue) {
      if (!this.valueAlreadyExists(this.props.value || [], this.state.newValue)) {
        const values = this.props.value || [];
        values.push(this.state.newValue);
        this.props.onChange(values);
      }

      this.setState({
        newValue: ''
      });
    }
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.add();
    }
  };

  openSelectorCallback = dataElementName => {
    this.setState({
      newValue: addDataElementToken(this.state.newValue, dataElementName)
    });
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector(this.openSelectorCallback);
  };

  valueAlreadyExists = (values, newValue) => values.some(value => value === newValue);

  render() {
    const value = this.props.value || [];

    return (
      <div className="TagListEditor">
        <label className="Label">{ this.props.title }</label>
        {
          this.props.tooltip ? <InfoTip>{ this.props.tooltip }</InfoTip> : null
        }
        <div>
          <Textfield
            className="Field--long"
            onChange={ this.onNewValueChange }
            onKeyPress={ this.handleKeyPress }
            value={ this.state.newValue }
          />
          <DataElementSelectorButton onClick={ this.openSelector } />
          <Button type="addButton" onClick={ this.add }>Add</Button>
          <div className="u-gapTop">
            <TagList
              onClose={ this.onRemove }
            >
              { value.map(
                (tag) => (
                  <Tag className="TagListEditor-tag" key={ tag } title={ tag }>{ tag }</Tag>
                )
              ) }
            </TagList>
          </div>
        </div>
      </div>
    );
  }
}
