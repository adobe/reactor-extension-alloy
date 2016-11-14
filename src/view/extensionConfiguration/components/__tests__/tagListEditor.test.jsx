import { mount } from 'enzyme';
import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { DataElementSelectorButton } from '@reactor/react-components';

import TagListEditor from '../tagListEditor';

const getReactComponents = (wrapper) => {
  const valueTextfield = wrapper.find(Textfield).node;
  const valueButton = wrapper.find(DataElementSelectorButton).node;
  const addButton = wrapper.find(Button).filterWhere(n => n.prop('children') === 'Add').node;
  const dataElementSelectorButton = wrapper.find(Button).node;

  return {
    valueTextfield,
    valueButton,
    addButton,
    dataElementSelectorButton
  };
};

describe('tag list editor', () => {
  let instance;
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = jasmine.createSpy('onChange');

    const props = {
      input: {
        value: [],
        onChange: onChangeSpy
      },
      meta: {
        touched: false,
        error: null
      }
    };

    instance = mount(<TagListEditor { ...props } />);
  });

  beforeEach(() => {
    onChangeSpy.calls.reset();
    window.extensionBridge = {};
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it('opens the data element selector from data element button', () => {
    const { valueButton } = getReactComponents(instance);

    window.extensionBridge.openDataElementSelector = jasmine.createSpy('openDataElementSelector')
      .and.callFake((callback) => {
        callback('foo');
      });

    valueButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
  });

  it('adds a new tag after selecting a data element from the modal', () => {
    const { dataElementSelectorButton } = getReactComponents(instance);

    window.extensionBridge.openDataElementSelector = jasmine.createSpy('openDataElementSelector')
      .and.callFake((callback) => {
        callback('foo');
      });

    dataElementSelectorButton.props.onClick();

    expect(onChangeSpy).toHaveBeenCalledWith(['%foo%']);
  });

  it('adds a new tag when the add button is clicked', () => {
    const {
      addButton,
      valueTextfield
    } = getReactComponents(instance);

    valueTextfield.props.onChange('somevalue');
    addButton.props.onClick();

    expect(onChangeSpy).toHaveBeenCalledWith(['somevalue']);
  });


  it('adds a new tag when the enter key is pressed', () => {
    const {
      valueTextfield
    } = getReactComponents(instance);

    valueTextfield.props.onChange({
      target: {
        value: 'somevalue'
      }
    });

    valueTextfield.props.onKeyPress({ key: 'Enter', keyCode: 13, which: 13 });
    expect(onChangeSpy).toHaveBeenCalledWith(['somevalue']);
  });
});
