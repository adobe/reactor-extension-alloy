'use strict';

var getQueryParam = require('get-query-param');
var logger = require('logger');
var window = require('window');

var eVarRegExp = /eVar([0-9]+)/;
var propRegExp = /prop([0-9]+)/;
var linkTrackVarsKeys = new RegExp('^(eVar[0-9]+)|(prop[0-9]+)|(hier[0-9]+)|campaign|purchaseID|' +
  'channel|server|state|zip|pageType$');

var buildLinkTrackVars = function(tracker, newTrackerProperties, addEvents) {
  var linkTrackVarsValues = Object.keys(newTrackerProperties)
    .filter(linkTrackVarsKeys.test.bind(linkTrackVarsKeys));

  if (addEvents) {
    linkTrackVarsValues.push('events');
  }

  // Merge with the values already set on tracker.
  linkTrackVarsValues = linkTrackVarsValues.concat((tracker.linkTrackVars || '').split(','));

  return linkTrackVarsValues.filter(function(value) {
    return value !== 'None';
  }).join(',');
};

var buildLinkTrackEvents = function(tracker, eventsData) {
  var linkTrackEventsValues = eventsData.map(function(event) {
    return event.name;
  });

  // Merge with the values already set on tracker.
  linkTrackEventsValues = linkTrackEventsValues.concat((tracker.linkTrackEvents || '').split(','));

  return linkTrackEventsValues.filter(function(value) {
    return value !== 'None';
  }).join(',');
};

var commaJoin = function(store, keyName, trackerProperties) {
  store[keyName] = trackerProperties[keyName].join(',');
};

var variablesTransform = function(store, keyName, trackerProperties) {
  var dynamicVariablePrefix = trackerProperties.dynamicVariablePrefix || 'D=';

  trackerProperties[keyName].forEach(function(variableData) {
    var value;
    if (variableData.type === 'value') {
      value = variableData.value;
    } else {
      var eVarData = eVarRegExp.exec(variableData.value);

      if (eVarData) {
        value = dynamicVariablePrefix + 'v' + eVarData[1];
      } else {
        var propData = propRegExp.exec(variableData.value);

        if (propData) {
          value = dynamicVariablePrefix + 'c' + propData[1];
        }
      }
    }

    store[variableData.name] = value;
  });
};

var transformers = {
  linkDownloadFileTypes: commaJoin,
  linkExternalFilters: commaJoin,
  linkInternalFilters: commaJoin,
  hierarchies: function(store, keyName, trackerProperties) {
    trackerProperties[keyName].forEach(function(hierarchyData) {
      store[hierarchyData.name] = hierarchyData.sections.join(hierarchyData.delimiter);
    });
  },
  props: variablesTransform,
  eVars: variablesTransform,
  campaign: function(store, keyName, trackerProperties) {
    if (trackerProperties[keyName].type === 'queryParam') {
      store[keyName] = getQueryParam(trackerProperties[keyName].value);
    } else {
      store[keyName] = trackerProperties[keyName].value;
    }
  },
  events: function(store, keyName, trackerProperties) {
    var events = trackerProperties[keyName].map(function(data) {
      if (data.value) {
        return [data.name, data.value].join(':');
      } else {
        return data.name;
      }
    });

    store[keyName] = events.join(',');
  }
};

module.exports = function(tracker, trackerProperties) {
  var newProperties = {};

  Object.keys(trackerProperties).forEach(function(propertyName) {
    var transform = transformers[propertyName];
    var value = trackerProperties[propertyName];

    if (transform) {
      transform(newProperties, propertyName, trackerProperties);
    } else {
      newProperties[propertyName] = value;
    }
  });

  var hasEvents =
    trackerProperties && trackerProperties.events && trackerProperties.events.length > 0;
  var linkTrackVars = buildLinkTrackVars(tracker, newProperties, hasEvents);
  if (linkTrackVars) {
    newProperties.linkTrackVars = linkTrackVars;
  }

  var linkTrackEvents = buildLinkTrackEvents(tracker, trackerProperties.events || []);
  if (linkTrackEvents) {
    newProperties.linkTrackEvents = linkTrackEvents;
  }

  logger.info(
    'Applying the following properties on tracker: "' +
    JSON.stringify(newProperties) +
    '".'
  );

  Object.keys(newProperties).forEach(function(propertyName) {
    tracker[propertyName] = newProperties[propertyName];
  });
};
