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
import Button from '@react/react-spectrum/Button';
import Textfield from '@react/react-spectrum/Textfield';
import Close from '@react/react-spectrum/Icon/Close';
import { FieldArray } from 'redux-form';
import WrappedField from '../extensionConfiguration/components/wrappedField';
import RestrictedComboBox from '../extensionConfiguration/components/restrictedComboBox';
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
      <WrappedField
        name={ `${field}.name` }
        className="u-gapRight2x"
        component={ RestrictedComboBox }
        placeholder="Select event"
        options={ nameOptions }
        allowEmpty
      />

      <WrappedField
        name={ `${field}.id` }
        component={ Textfield }
        componentClassName="Field--shorter"
        placeholder="Event ID (optional)"
        supportDataElement
      />

      <WrappedField
        name={ `${field}.value` }
        component={ Textfield }
        componentClassName="Field--shorter"
        placeholder="Event Value (optional)"
        supportDataElement
      />

      <Button
        variant="action"
        quiet
        icon={ <Close /> }
        size="XS"
        onClick={ fields.remove.bind(this, index) }
      />
    </div>
  ));

  return (
    <section>
      { rows }
      <Button variant="action" onClick={ () => fields.push(createEmptyRow()) }>Add Another</Button>
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
