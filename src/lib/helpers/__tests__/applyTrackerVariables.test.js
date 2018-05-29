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

'use strict';

var applyTrackerVariablesInjector = require('inject!../applyTrackerVariables');

var getApplyTrackerVariables = function(mocks) {
  return applyTrackerVariablesInjector(mocks || {});
};

describe('apply tracker variables', function() {
  var applyTrackerVariables;
  var tracker;

  beforeAll(function() {
    mockTurbineVariable({
      logger: jasmine.createSpyObj('logger', ['info', 'error', 'warn', 'log'])
    });
  });

  afterAll(function() {
    resetTurbineVariable();
  });

  beforeEach(function() {
    applyTrackerVariables = getApplyTrackerVariables();
    tracker = {};
  });

  it('sets link download file types on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkDownloadFileTypes: ['avi', 'exe']
    });

    expect(tracker.linkDownloadFileTypes).toBe('avi,exe');
  });

  it('sets link external filters on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkExternalFilters: ['http://www.page1.com', 'http://www.page2.com']
    });

    expect(tracker.linkExternalFilters).toBe('http://www.page1.com,http://www.page2.com');
  });

  it('sets link internal filters on the tracker', function() {
    applyTrackerVariables(tracker, {
      linkInternalFilters: ['tel://', 'mailto://']
    });

    expect(tracker.linkInternalFilters).toBe('tel://,mailto://');
  });

  it('sets hierarchies on the tracker', function() {
    applyTrackerVariables(tracker, {
      hierarchies: [{
        name: 'hier1',
        sections: ['a', 'b', 'c', 'd'],
        delimiter: ','
      }]
    });

    expect(tracker.hier1).toBe('a,b,c,d');
  });

  it('sets evars on the tracker', function() {
    applyTrackerVariables(tracker, {
      eVars: [
        {
          name: 'eVar1',
          type: 'value',
          value: '1'
        },
        {
          name: 'eVar2',
          type: 'alias',
          value: 'eVar1'
        },
        {
          name: 'eVar3',
          type: 'alias',
          value: 'prop1'
        }
      ]
    });

    expect(tracker.eVar1).toBe('1');
    expect(tracker.eVar2).toBe('D=v1');
    expect(tracker.eVar3).toBe('D=c1');
  });

  it('sets evars using a different prefix', function() {
    applyTrackerVariables(tracker, {
      dynamicVariablePrefix: 'a=',
      eVars: [
        {
          name: 'eVar1',
          type: 'alias',
          value: 'eVar2'
        }
      ]
    });

    expect(tracker.eVar1).toBe('a=v2');
  });

  it('sets props on the tracker', function() {
    applyTrackerVariables(tracker, {
      eVars: [
        {
          name: 'prop1',
          type: 'value',
          value: '1'
        },
        {
          name: 'prop2',
          type: 'alias',
          value: 'eVar2'
        },
        {
          name: 'prop3',
          type: 'alias',
          value: 'prop2'
        }
      ]
    });

    expect(tracker.prop1).toBe('1');
    expect(tracker.prop2).toBe('D=v2');
    expect(tracker.prop3).toBe('D=c2');
  });

  it('sets props using a different prefix', function() {
    applyTrackerVariables(tracker, {
      dynamicVariablePrefix: 'a=',
      props: [
        {
          name: 'prop1',
          type: 'alias',
          value: 'eVar2'
        }
      ]
    });

    expect(tracker.prop1).toBe('a=v2');
  });

  it('sets events on the tracker', function() {
    applyTrackerVariables(tracker, {
      events: [
        {
          name: 'prodView'
        },
        {
          name: 'scOpen',
          value: 'some'
        }
      ]
    });

    expect(tracker.events).toBe('prodView,scOpen=some');
  });

  it('sets multiple events on the tracker', function() {
    applyTrackerVariables(tracker, {
      events: [
        {
          name: 'event123'
        }
      ]
    });
    applyTrackerVariables(tracker, {
      events: [
        {
          name: 'event345',
          value: '1.5'
        }
      ]
    });

    expect(tracker.events).toBe('event123,event345=1.5');
  });

  it('sets campaigns on the tracker', function() {
    applyTrackerVariables(tracker, {
      campaign: {
        type: 'value',
        value: 'some'
      }
    });

    expect(tracker.linkTrackVars).toBe('campaign');
    expect(tracker.campaign).toBe('some');
  });

  it('sets campaigns from query param on the tracker', function() {
    applyTrackerVariables = getApplyTrackerVariables({
      '@adobe/reactor-window': {
        location: {
          search: '?someparam=somevalue'
        }
      }
    });

    applyTrackerVariables(tracker, {
      campaign: {
        type: 'queryParam',
        value: 'someparam'
      }
    });

    expect(tracker.linkTrackVars).toBe('campaign');
    expect(tracker.campaign).toBe('somevalue');
  });

  it('sets other porperties on the tracker', function() {
    applyTrackerVariables(tracker, {
      a: 'b'
    });

    expect(tracker.a).toBe('b');
  });

  it('sets a filtered list inside linkTrackVars', function() {
    tracker.linkTrackVars = 'eVar1';

    applyTrackerVariables(tracker, {
      eVars: [
        {
          name: 'eVar1',
          type: 'value',
          value: '1'
        },
        {
          name: 'eVar2',
          type: 'alias',
          value: 'eVar1'
        }
      ]
    });

    expect(tracker.linkTrackVars).toBe('eVar1,eVar2');
  });

  it('sets a filtered list inside linkTrackEvents', function() {
    tracker.linkTrackEvents = 'event1';

    applyTrackerVariables(tracker, {
      events: [
        {
          name: 'event1',
          value: '1'
        },
        {
          name: 'event2',
          value: '2'
        }
      ]
    });

    expect(tracker.linkTrackEvents).toBe('event1,event2');
  });
});
