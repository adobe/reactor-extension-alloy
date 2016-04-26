import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';

export default class General extends React.Component {
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

export const formConfig = createFormConfig({
  fields: [],
  settingsToFormValues(values, options) {
    return values;
  },
  formValuesToSettings(settings, values) {
    return {
      ...settings
    };
  }
});
