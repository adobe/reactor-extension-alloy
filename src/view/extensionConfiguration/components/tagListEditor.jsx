import Coral from '@coralui/coralui-support-reduxform';
import { DataElementSelectorButton, ValidationWrapper, InfoTip } from '@reactor/react-components';
import React from 'react';
import addDataElementToken from '../../utils/addDataElementToken';

export default class TagListEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newValue: ''
    };
  }

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

    this.refs.valueField.coralComponent.focus();
  };

  onNewValueChange = event => {
    const newValue = event.target ? event.target.value : event;
    this.setState({
      newValue
    });
  };

  handleKeyPress = event => {
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey && !event.altKey) {
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

  valueAlreadyExists = (values, newValue) => {
    return values.some(value => value === newValue);
  };

  render() {
    const value = this.props.value || [];

    return (
      <div className="TagListEditor">
        <label className="Label">{ this.props.title }</label>
        {
          this.props.tooltip ? <InfoTip>{this.props.tooltip}</InfoTip> : null
        }
        <div>
          <Coral.Textfield
            ref="valueField"
            className="TagListEditor-valueInput"
            onKeyUp={this.onNewValueChange}
            onKeyPress={this.handleKeyPress}
            value={this.state.newValue}
          />
          <DataElementSelectorButton onClick={this.openSelector} />
          <Coral.Button onClick={this.add}>Add</Coral.Button>
          <div className="u-gapTop">
            <Coral.TagList
              ref="tagList"
              onChange={this.props.onChange}>
              {value.map((tag) => {
                return (
                  <Coral.Tag
                    className="TagListEditor-tag"
                    key={tag}
                    value={tag}
                    title={tag}>
                    {tag}
                  </Coral.Tag>
                );
              })}
            </Coral.TagList>
          </div>
        </div>
      </div>
    );
  }
}
