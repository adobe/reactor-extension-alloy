/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import React from 'react';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/redux-form-react-coral/lib/Textfield';
import Autocomplete from '@coralui/redux-form-react-coral/lib/Autocomplete';
import { Field, FieldArray } from 'redux-form';
import DecoratedInput from '@reactor/react-components/lib/reduxForm/decoratedInput';
import LIMITS, { LIMITS_LEVELS_LABELS, maxLevel } from '../enums/accessLevelLimits';

const CONTEXT_EVENTS = [
  'prodView',
  'scOpen',
  'scAdd',
  'scRemove',
  'scView',
  'scCheckout',
  'purchase'
];

const createOptions = (numItems) => {
  const options = [];

  for (let i = 0; i < numItems; i++) {
    const value = `event${i + 1}`;
    let label = value;
    const accessLevels = [];

    Object.keys(LIMITS_LEVELS_LABELS).forEach((accessLevel) => {
      if (i + 1 <= LIMITS.event[accessLevel]) {
        accessLevels.push(LIMITS_LEVELS_LABELS[accessLevel]);
      }
    });

    if (accessLevels.length !== Object.keys(LIMITS_LEVELS_LABELS).length) {
      label += ` (${accessLevels.join(', ')})`;
    }

    options.push({
      label,
      value
    });
  }

  return options;
};

let nameOptions = CONTEXT_EVENTS.map(value => ({ label: value, value }));
nameOptions = nameOptions.concat(createOptions(maxLevel('event')));

const createEmptyRow = () => ({});

const renderEvents = ({ fields }) => {
  const rows = fields.map((field, index) => (
    <div
      data-row
      key={ index }
      className="u-gapBottom2x"
    >
      <Field
        name={ `${field}.name` }
        className="u-gapRight2x"
        component={ DecoratedInput }
        inputComponent={ Autocomplete }
        placeholder="Select event"
        options={ nameOptions }
      />

      <Field
        name={ `${field}.id` }
        component={ DecoratedInput }
        inputComponent={ Textfield }
        inputClassName="Field--short"
        placeholder="Event ID (optional)"
        supportDataElement
      />

      <Field
        name={ `${field}.value` }
        component={ DecoratedInput }
        inputComponent={ Textfield }
        inputClassName="Field--short"
        placeholder="Event Value (optional)"
        supportDataElement
      />

      <Button
        variant="minimal"
        icon="close"
        iconSize="XS"
        square
        onClick={ fields.remove.bind(this, index) }
      />
    </div>
  ));

  return (
    <section>
      { rows }
      <Button onClick={ () => fields.push(createEmptyRow()) }>Add Another</Button>
    </section>
  );
};

export default () => (
  <FieldArray
    name="trackerProperties.events"
    component={ renderEvents }
  />
);

export const formConfig = {
  settingsToFormValues(values, settings) {
    let {
      events
    } = settings.trackerProperties || {};

    events = events ? events.slice() : [];

    // Add an extra object which will ensures that there is an empty row available for the user
    // to configure their next variable.
    events.push(createEmptyRow());

    events.map(event => ({ ...event }));

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

    const events = trackerProperties.events
      .filter(event => event.name)
      .map((event) => {
        // Goals are to exclude value if it's an empty string.

        const trimmedEvent = {
          name: event.name
        };

        if (event.value) {
          trimmedEvent.value = event.value;
        }
        if (event.id) {
          trimmedEvent.id = event.id;
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
  validate(errors, values = { trackerProperties: {} }) {
    const trackerProperties = values.trackerProperties || {};
    const events = trackerProperties.events || [];
    const configuredEventNames = [];

    const eventsErrors = events.map((event) => {
      const eventErrors = {};

      if (event.name) {
        if (configuredEventNames.indexOf(event.name) === -1) {
          configuredEventNames.push(event.name);
        } else {
          eventErrors.name = 'This event is already configured';
        }
      } else if (event.value) {
        eventErrors.name = 'Please provide a name';
      } else if (event.id) {
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
