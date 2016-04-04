import Coral from '@coralui/coralui-support-reduxform';
import { DataElementSelectorButton, ValidationWrapper } from '@reactor/react-components';
import React from 'react';

export default class TagListEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: ''
    };
  }

  add = () => {
    if (!this.state.value) {
      this.setState({
        error: 'Please provide a value'
      });
    } else if (this.valueAlreadyExists(this.props.tags, this.state.value)) {
      this.setState({
        error: 'Value already exists'
      });
    } else {
      this.props.tags.addField(this.state.value);

      this.setState({
        value: '',
        error: ''
      });
    }

    this.refs.valueField.coralComponent.focus();
  };

  onTagListChange = (event) => {
    const currentTagValues = event.target.values;
    const tags = this.props.tags;

    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      if (currentTagValues.indexOf(tag.value) === -1) {
        tags.removeField(i);
        return;
      }
    }
  };

  onValueChange = event => {
    const value = event.target ? event.target.value : event;
    this.setState({
      value
    });
  };

  handleKeyPress = event => {
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey && !event.altKey) {
      this.add();
    }
  };

  openSelectorCallback = dataElementName => {
    this.setState({
      value: this.state.value + '%' + dataElementName + '%'
    });
  };

  openSelector = () => {
    window.extensionBridge.openDataElementSelector(this.openSelectorCallback);
  };

  valueAlreadyExists = (tagFields, value) => {
    return tagFields.some(tagField => tagField.value === value);
  };

  render() {
    const { tags } = this.props;
    return (
      <div className="TagListEditor">
        <label className="u-label">{ this.props.title }</label>
        {
          this.props.tooltip ?
            <span>
              <Coral.Icon icon="infoCircle" size="XS"></Coral.Icon>
              <Coral.Tooltip placement="right" target="_prev">
                {this.props.tooltip}
              </Coral.Tooltip>
            </span> : null
        }
        <div>
          <ValidationWrapper ref="validationWrapper" error={this.state.error}>
            <Coral.Textfield
              ref="valueField"
              className="TagListEditor-valueInput"
              onKeyUp={this.onValueChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.value}
            />
          </ValidationWrapper>
          <DataElementSelectorButton onClick={this.openSelector} />
          <Coral.Button onClick={this.add}>Add</Coral.Button>
          <div className="u-gapTop">
            <Coral.TagList
              ref="tagList"
              onChange={this.onTagListChange}>
              {tags.map((field) => {
                return (
                  <Coral.Tag
                    className="TagListEditor-tag"
                    key={field.value}
                    value={field.value}
                    title={field.value}>
                    {field.value}
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
