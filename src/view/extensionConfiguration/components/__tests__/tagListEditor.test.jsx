import { mount } from 'enzyme';
import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { DataElementSelectorButton } from '@reactor/react-components';

import TagListEditor from '../tagListEditor';

const getReactComponents = (wrapper) => {
  const valueTextfieldWrapper = wrapper.find(Textfield);
  const valueTextfield = valueTextfieldWrapper.node;
  const valueButton = wrapper.find(DataElementSelectorButton).node;
  const addButton = wrapper.find(Button).filterWhere(n => n.prop('type') === 'addButton').node;

  return {
    valueTextfieldWrapper,
    valueTextfield,
    valueButton,
    addButton
  };
};

describe('tag list editor', () => {
  let instance;

  beforeAll(() => {
    instance = mount(<TagListEditor />);
  });

  it('opens the data element selector from data element button', () => {
    const { valueTextfield, valueButton } = getReactComponents(instance);

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    valueButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(valueTextfield.props.value).toBe('%foo%');
  });

  it('adds a new tag when the add button is clicked', () => {
    const spy = jasmine.createSpy('onChange');
    instance = mount(
      <TagListEditor onChange={spy} />
    );

    const {
      addButton,
      valueTextfield
    } = getReactComponents(instance);

    valueTextfield.props.onChange('somevalue');
    addButton.props.onClick();

    expect(spy).toHaveBeenCalledWith(['somevalue']);
  });


  it('adds a new tag when the enter key is pressed', () => {
    const spy = jasmine.createSpy();
    instance = mount(
      <TagListEditor onChange={spy} />
    );

    const {
      valueTextfield,
      valueTextfieldWrapper
    } = getReactComponents(instance);

    valueTextfield.props.onChange({
      target: {
        value: 'somevalue'
      }
    });

    valueTextfieldWrapper.simulate('keypress', { key: 'Enter', keyCode: 13, which: 13 });
    expect(spy).toHaveBeenCalledWith(['somevalue']);
  });
});
