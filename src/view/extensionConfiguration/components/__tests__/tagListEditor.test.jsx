import React from 'react';
import TagListEditor from '../tagListEditor';
import TestUtils from 'react-addons-test-utils';

describe('tag list editor', () => {
  let instance;

  beforeAll(() => {
    instance =  TestUtils.renderIntoDocument(
      <TagListEditor />
    );
  });

  it('opens the data element selector from data element button', () => {
    const { valueTextfield, valueButton } = instance.refs;

    spyOn(window.extensionBridge, 'openDataElementSelector').and.callFake(callback => {
      callback('foo');
    });

    valueButton.props.onClick();

    expect(window.extensionBridge.openDataElementSelector).toHaveBeenCalled();
    expect(valueTextfield.props.value).toBe('%foo%');
  });

  it('adds a new tag when the add button is clicked', () => {
    const spy = jasmine.createSpy();
    instance =  TestUtils.renderIntoDocument(
      <TagListEditor onChange={spy}/>
    );

    const {
      addButton,
      valueTextfield,
    } = instance.refs;

    valueTextfield.props.onKeyUp('somevalue');
    addButton.props.onClick();

    expect(spy).toHaveBeenCalledWith(['somevalue']);
  });


  it('adds a new tag when the enter key is pressed', () => {
    const spy = jasmine.createSpy();
    instance =  TestUtils.renderIntoDocument(
      <TagListEditor onChange={spy}/>
    );

    const {
      valueTextfield
    } = instance.refs;

    valueTextfield.props.onKeyUp({
      target: {
        value: 'somevalue'
      }
    });
    valueTextfield.props.onKeyPress({
      keyCode: 13
    });

    expect(spy).toHaveBeenCalledWith(['somevalue']);
  });

  it('deletes a tag when the remove button is clicked', () => {
    const spy = jasmine.createSpy();
    instance =  TestUtils.renderIntoDocument(
      <TagListEditor onChange={spy}/>
    );

    const {
      tagList
    } = instance.refs;

    tagList.props.onChange('somevalue');


    expect(spy).toHaveBeenCalledWith('somevalue');
  });
});
