import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { DataElementField } from '@reactor/react-components';
import createId from '../utils/createId';

export default class EVars extends React.Component {
  createEVarOptions = selectedValue => {
    var options = [];

    for (var i = 0; i < 250; i++) {
      var value = 'eVar' + (i + 1);
      options.push(
        <Coral.Autocomplete.Item key={value} value={value} selected={selectedValue === value}>
          {value}
        </Coral.Autocomplete.Item>
      );
    }

    return options;
  };

  createAliasOptions = selectedValue => {
    var options = [];

    for (var i = 0; i < 75; i++) {
      var value = 'prop' + (i + 1);
      options.push(
        <Coral.Autocomplete.Item key={value} value={value} selected={selectedValue === value}>
          {value}
        </Coral.Autocomplete.Item>
      )
    }

    options = options.concat(this.createEVarOptions());

    return options;
  };

  onRowFocus = focusIndex => {
    if (focusIndex === this.props.fields.eVars.length - 1) {
      this.createEmptyRow();
    }
  };

  createEmptyRow = () => {
    this.props.fields.eVars.addField({
      id: createId()
    });
  };

  render() {
    console.log('render')
    const eVars = this.props.fields.eVars;

    const rows = eVars.map((eVar, index) => {
      console.log(eVar.value.value);
      // We have to set "selected" on the individual options instead of the top-level selects
      // due to https://jira.corp.adobe.com/browse/CUI-5527
      var eVarOptions = this.createEVarOptions(eVar.name.value);
      var aliasOptions = this.createAliasOptions(eVar.value.value);

      return (
        <div key={eVar.id.value} onFocus={this.onRowFocus.bind(this, index)}>
          <Coral.Autocomplete
            placeholder="Select eVar"
            onChange={eVar.name.onChange}>
            {eVarOptions}
          </Coral.Autocomplete>
          <Coral.Select onChange={eVar.type.onChange}>
            <Coral.Select.Item
              value="value">
              Set as
            </Coral.Select.Item>
            <Coral.Select.Item
              value="alias"
              selected={eVar.type.value === 'alias'}>
              Duplicate from
            </Coral.Select.Item>
          </Coral.Select>
          {
            eVar.type.value !== 'alias' ?
              <Coral.Textfield {...eVar.value}/> :
              <Coral.Autocomplete
                placeholder="Select Variable">
                {aliasOptions}
              </Coral.Autocomplete>
          }
          {
            index !== eVars.length - 1 ?
              <Coral.Button
                ref="removeButton"
                className="u-gapBottom"
                variant="quiet"
                icon="close"
                iconsize="S"/> : null
          }
        </div>
      );
    });

    return <div>{rows}</div>;
  }
}

export const formConfig = {
  fields: [
    'eVars[].id',
    'eVars[].name',
    'eVars[].type',
    'eVars[].value'
  ],
  settingsToFormValues(values, options) {
    let {
      eVars
    } = options.settings;

    eVars = eVars ? eVars.slice() : [];
    eVars.push({});

    eVars.forEach(eVar => {
      eVar.id = createId();
      eVar.type = eVar.type || 'value'
    });

    values = {
      ...values,
      eVars
    };

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };
    
    const eVars = values.eVars.filter(eVar => {
      return eVar.name;
    }).map(eVar => {
      // Everything but id.
      return {
        name: eVar.name,
        type: eVar.type,
        value: eVar.value
      };
    });

    if (eVars.length) {
      settings.eVars = eVars;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };
    
    errors.eVars = values.eVars.map(eVar => {
      const result = {};

      if (eVar.value && !eVar.name) {
        result.name = 'Please enter a name';
      }

      return result;
    });

    return errors;
  }
};

