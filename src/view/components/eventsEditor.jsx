import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import createId from '../utils/createId';
import openDataElementSelector from '../utils/openDataElementSelector';

// TODO: Replace with actual values from user's product level.
const MAX_EVENTS = 100;

const CONTEXT_EVENTS = [
  'prodView',
  'scOpen',
  'scAdd',
  'scRemove',
  'scView',
  'scCheckout',
  'purchase'
];

export default class EventsEditor extends React.Component {
  createOption = value => {
    return <Coral.Select.Item key={value} value={value}>{value}</Coral.Select.Item>;
  };

  createOptions = () => {
    const options = CONTEXT_EVENTS.map(this.createOption);

    for (let i = 0; i < MAX_EVENTS; i++) {
      const value = 'event' + (i + 1);
      options.push(this.createOption(value));
    }

    return options;
  };

  createEmptyRow = () => {
    this.props.fields.trackerProperties.events.addField({
      id: createId()
    });
  };

  removeEvent = index => {
    this.props.fields.trackerProperties.events.removeField(index);
  };

  render() {
    const events = this.props.fields.trackerProperties.events;

    const rows = events.map((event, index) => {
      const nameOptions = this.createOptions();
      const namePlaceholder = 'Select event';

      return (
        <div
          key={event.id.value}
          className="u-gapBottom2x">
          <ValidationWrapper
            error={event.name.touched && event.name.error}
            className="u-gapRight2x">
            <Coral.Select
              className="Field--short"
              placeholder={namePlaceholder}
              {...event.name}>
              {nameOptions}
            </Coral.Select>
          </ValidationWrapper>
          <span className="Label u-gapRight">Serialize from value</span>
          <Coral.Textfield
            className="Field--short"
            {...event.value}/>
          <DataElementSelectorButton
            onClick={openDataElementSelector.bind(this, event.value)}/>
          <Coral.Button
            ref="removeButton"
            variant="quiet"
            icon="close"
            iconSize="XS"
            onClick={this.removeEvent.bind(this, index)}/>
        </div>
      );
    });

    return (
      <section>
        {rows}
        <Coral.Button onClick={this.createEmptyRow}>Add event</Coral.Button>
      </section>
    );
  }
}

export const formConfig = {
  fields: [
    'trackerProperties.events[].id',
    'trackerProperties.events[].name',
    'trackerProperties.events[].value'
  ],
  settingsToFormValues(values, options) {
    let {
      events
    } = options.settings.trackerProperties || {};

    events = events ? events.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next variable.
    events.push({});

    events.forEach(event => {
      event.id = createId();
    });

    return {
      ...values,
      trackerProperties: {
        ...values.trackerProperties,
        events
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      trackerProperties
    } = values;

    const events = trackerProperties.events.filter(event => {
      return event.name;
    }).map(event => {
      // Goals are to exclude ID and exclude value if it's an empty string.

      var trimmedEvent = {
        name: event.name
      };

      if (event.value) {
        trimmedEvent.value = event.value;
      }

      return trimmedEvent;
    });

    settings = {
      ...settings
    };

    if (events.length) {
      settings.trackerProperties = {
        ...settings.trackerProperties,
        events
      };
    }

    return settings;
  },
  validate(errors, values) {
    const events = values.trackerProperties.events;
    const configuredEventNames = [];

    const eventsErrors = events.map(event => {
      const eventErrors = {};

      if (event.name) {
        if (configuredEventNames.indexOf(event.name) === -1) {
          configuredEventNames.push(event.name);
        } else {
          eventErrors.name = 'This event is already configured';
        }
      } else if (event.value) {
        eventErrors.name = 'Please provide a name';
      }

      return eventErrors;
    });

    return {
      ...errors,
      trackerProperties: {
        ...errors.trackerProperties,
        events: eventsErrors
      }
    };
  }
};
