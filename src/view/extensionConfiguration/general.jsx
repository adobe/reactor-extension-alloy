import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import extensionViewReduxForm from '../extensionViewReduxForm';

class ExtensionConfiguration extends React.Component {
  render() {
    return (
      <div>
        <Coral.Checkbox>Enable EU compliance for Adobe Analytics</Coral.Checkbox>
        <div>
          Character Set
          <div>
            <Coral.Radio>Pre-defined</Coral.Radio>
            <Coral.Select>
              <Coral.Select.Item>UTF-8</Coral.Select.Item>
              <Coral.Select.Item>CP1252</Coral.Select.Item>
              <Coral.Select.Item>Windows-1257</Coral.Select.Item>
              <Coral.Select.Item>ISO-8859-1</Coral.Select.Item>
              <Coral.Select.Item>ISO-8859-2</Coral.Select.Item>
              <Coral.Select.Item>ISO-8859-4</Coral.Select.Item>
              <Coral.Select.Item>ISO-8859-5</Coral.Select.Item>
              <Coral.Select.Item>ISO-8859-10</Coral.Select.Item>
              <Coral.Select.Item>Big5</Coral.Select.Item>
              <Coral.Select.Item>EUC-KR</Coral.Select.Item>
              <Coral.Select.Item>GB2312</Coral.Select.Item>
              <Coral.Select.Item>SJIS</Coral.Select.Item>
            </Coral.Select>
          </div>
        </div>
      </div>
    );
  }
}

const formConfig = {
  fields: [],
  formValuesToSettings(settings, values) {
    return {
      //browsers: values.browsers || [] // An array is required.
    };
  }
};

export default extensionViewReduxForm(formConfig)(ExtensionConfiguration);
