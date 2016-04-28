import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import classNames from 'classnames';
import createFormConfig from '../utils/createFormConfig';
import { DataElementField, ValidationWrapper } from '@reactor/react-components';
import createId from '../utils/createId';

// TODO: Replace with actual values from user's product level.
const MAX_EVARS = 250;
const MAX_PROPS = 75;

export default class EVars extends React.Component {
  createEVarOptions = selectedValue => {
    var options = [];

    for (var i = 0; i < MAX_EVARS; i++) {
      var value = 'eVar' + (i + 1);
      options.push(
        <Coral.Select.Item key={value} value={value} selected={selectedValue === value}>
          {value}
        </Coral.Select.Item>
      );
    }

    return options;
  };

  createAliasOptions = selectedValue => {
    var options = [];

    for (var i = 0; i < MAX_PROPS; i++) {
      var value = 'prop' + (i + 1);
      options.push(
        <Coral.Select.Item key={value} value={value} selected={selectedValue === value}>
          {value}
        </Coral.Select.Item>
      )
    }

    options = options.concat(this.createEVarOptions());

    return options;
  };

  createEmptyRow = () => {
    this.props.fields.trackerProperties.eVars.addField({
      id: createId()
    });
  };

  removeEVar = index => {
    this.props.fields.trackerProperties.eVars.removeField(index);
  };

  render() {
    const eVars = this.props.fields.trackerProperties.eVars;

    const rows = eVars.map((eVar, index) => {
      // We have to set "selected" on the individual options instead of the top-level selects
      // due to https://jira.corp.adobe.com/browse/CUI-5527
      var eVarOptions = this.createEVarOptions(eVar.name.value);
      var aliasOptions = this.createAliasOptions(eVar.value.value);

      return (
        <div
          key={eVar.id.value}
          className="u-gapBottom2x">
          <ValidationWrapper
            error={eVar.name.touched && eVar.name.error}
            className="u-gapRight2x">
            <Coral.Select
              className="Variables-smallField"
              placeholder="Select eVar"
              onChange={eVar.name.onChange}>
              {eVarOptions}
            </Coral.Select>
          </ValidationWrapper>
          <Coral.Select
            className="Variables-smallField u-gapRight2x"
            onChange={eVar.type.onChange}>
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
          <ValidationWrapper error={eVar.value.touched && eVar.value.error}>
            {
              eVar.type.value !== 'alias' ?
                <Coral.Textfield
                  className="Variables-smallField"
                  {...eVar.value}/> :
                <Coral.Select
                  className="Variables-smallField"
                  placeholder="Select Variable"
                  onChange={eVar.value.onChange}>
                  {aliasOptions}
                </Coral.Select>
            }
          </ValidationWrapper>
          {
            index !== eVars.length - 1 ?
              <Coral.Button
                ref="removeButton"
                variant="quiet"
                icon="close"
                iconsize="S"
                onClick={this.removeEVar.bind(this, index)}/> : null
          }
        </div>
      );
    });

    return (
      <section>
        <h4 className="coral-Heading coral-Heading--4">eVars</h4>
        {rows}
        <Coral.Button onClick={this.createEmptyRow}>Add eVar</Coral.Button>
      </section>
    );
  }
}

export const formConfig = createFormConfig({
  fields: [
    'trackerProperties.eVars[].id',
    'trackerProperties.eVars[].name',
    'trackerProperties.eVars[].type',
    'trackerProperties.eVars[].value'
  ],
  settingsToFormValues(values, options) {
    values = {
      ...values,
    };

    let eVars;

    if (options.settings.trackerProperties) {
      eVars = options.settings.trackerProperties.eVars;
    }

    eVars = eVars ? eVars.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next eVar.
    eVars.push({});

    eVars.forEach(eVar => {
      eVar.id = createId();
      eVar.type = eVar.type || 'value'
    });

    values.trackerProperties = values.trackerProperties || {};
    values.trackerProperties.eVars = eVars;

    return values;
  },
  formValuesToSettings(settings, values) {
    settings = {
      ...settings
    };

    const eVars = values.trackerProperties.eVars.filter(eVar => {
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
      settings.trackerProperties = settings.trackerProperties || {};
      settings.trackerProperties.eVars = eVars;
    }

    return settings;
  },
  validate(errors, values) {
    errors = {
      ...errors
    };


    errors.trackerProperties = errors.trackerProperties || {};

    const configuredEVarNames = [];

    errors.trackerProperties.eVars = values.trackerProperties.eVars.map(eVar => {
      const eVarErrors = {};

      if (eVar.name) {
        const match = eVar.name.match(/^eVar(\d+)$/);
        const varNumber = match ? match[1] : null;

        if (match && varNumber > 0 && varNumber <= MAX_EVARS) {
          if (configuredEVarNames.indexOf(eVar.name) === -1) {
            configuredEVarNames.push(eVar.name);
          } else {
            eVarErrors.name = 'This eVar is already configured';
          }
        } else {
          eVarErrors.name = 'Please enter a valid name';
        }
      } else if (eVar.value) {
        eVarErrors.name = 'Please enter a name'; // TODO: This would change if we proceeded with Selects
      }

      if (eVar.value) {
        if (eVar.type === 'alias') {
          const match = eVar.value.match(/^(eVar|prop)(\d+)$/);
          const varNumber = match ? match[2] : null;

          if (!match || varNumber < 1 ||
            (match[1] === 'eVar' && varNumber > MAX_EVARS) ||
            (match[1] === 'prop' && varNumber > MAX_PROPS)) {
            eVarErrors.value = 'Please enter a valid value';
          }
        }
      } else if (eVar.name) {
        eVarErrors.value = 'Please enter a value';
      }

      return eVarErrors;
    });

    return errors;
  }
});

