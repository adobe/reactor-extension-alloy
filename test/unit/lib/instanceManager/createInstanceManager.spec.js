/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import createInstanceManager from "../../../../src/lib/instanceManager/createInstanceManager";

describe("Instance Manager", () => {
  let instanceManager;
  let turbine;
  let mockWindow;
  let createInstance;
  let createEventMergeId;
  let wrapOnBeforeEventSend;
  let onBeforeEventSend;
  let alloy1;
  let alloy2;
  let extensionSettings;
  let getConfigOverrides;

  const build = () => {
    instanceManager = createInstanceManager({
      turbine,
      window: mockWindow,
      createInstance,
      orgId: "ABC@AdobeOrg",
      createEventMergeId,
      wrapOnBeforeEventSend,
      getConfigOverrides
    });
  };

  beforeEach(() => {
    extensionSettings = {
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          stagingEdgeConfigId: "PR123:stage",
          developmentEdgeConfigId: "PR123:dev"
        },
        {
          name: "alloy2",
          edgeConfigId: "PR456",
          orgId: "DIFFERENTORG@AdobeOrg"
        }
      ]
    };
    turbine = jasmine.createSpyObj({
      getExtensionSettings: extensionSettings,
      onDebugChanged: undefined,
      environment: { stage: "production" }
    });
    turbine.debugEnabled = false;
    mockWindow = {};
    getConfigOverrides = jasmine.createSpy("getConfigOverrides");
    alloy1 = jasmine.createSpy("alloy1");
    alloy2 = jasmine.createSpy("alloy2");
    createInstance = jasmine.createSpy().and.callFake(({ name }) => {
      if (name === "alloy1") {
        return alloy1;
      }
      if (name === "alloy2") {
        return alloy2;
      }
      return undefined;
    });
    onBeforeEventSend = jasmine.createSpy();
    wrapOnBeforeEventSend = jasmine
      .createSpy()
      .and.returnValue(onBeforeEventSend);
  });

  it("creates SDK instances", () => {
    build();
    expect(mockWindow).toEqual({ alloy1, alloy2 });
  });

  it("configures an SDK instance for each configured instance", () => {
    build();
    expect(alloy1).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR123",
      debugEnabled: false,
      orgId: "ABC@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function),
      edgeConfigOverrides: undefined
    });
    expect(alloy2).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR456",
      debugEnabled: false,
      orgId: "DIFFERENTORG@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function),
      edgeConfigOverrides: undefined
    });
  });

  it("configures SDK instance with debugging enabled if Launch debugging is enabled", () => {
    turbine.debugEnabled = true;
    build();
    expect(alloy1).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR123",
      debugEnabled: true,
      orgId: "ABC@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function),
      edgeConfigOverrides: undefined
    });
  });

  it("toggles SDK debugging when Launch debugging is toggled", () => {
    const onDebugChangedCallbacks = [];
    turbine.onDebugChanged.and.callFake(callback => {
      onDebugChangedCallbacks.push(callback);
    });
    build();
    onDebugChangedCallbacks.forEach(callback => callback(true));
    expect(alloy1).toHaveBeenCalledWith("setDebug", {
      enabled: true
    });
    onDebugChangedCallbacks.forEach(callback => callback(false));
    expect(alloy1).toHaveBeenCalledWith("setDebug", {
      enabled: false
    });
  });

  it("returns instance by name", () => {
    build();
    const instance = instanceManager.getInstance("alloy2");
    expect(instance).toBe(alloy2);
  });

  it("creates an event merge ID", () => {
    createEventMergeId = jasmine
      .createSpy()
      .and.returnValue("randomEventMergeId");
    build();
    const eventMergeId = instanceManager.createEventMergeId();
    expect(eventMergeId).toBe("randomEventMergeId");
  });

  it("handles a staging environment", () => {
    turbine.environment.stage = "staging";
    build();
    expect(alloy1.calls.argsFor(0)[1].edgeConfigId).toEqual("PR123:stage");
    expect(alloy2.calls.argsFor(0)[1].edgeConfigId).toEqual("PR456");
  });

  it("handles a development environment", () => {
    turbine.environment.stage = "development";
    build();
    expect(alloy1.calls.argsFor(0)[1].edgeConfigId).toEqual("PR123:dev");
    expect(alloy2.calls.argsFor(0)[1].edgeConfigId).toEqual("PR456");
  });

  it("wraps onBeforeEventSend", () => {
    build();
    const {
      onBeforeEventSend: configuredOnBeforeEventSend
    } = alloy1.calls.argsFor(0)[1];
    expect(configuredOnBeforeEventSend).toBe(onBeforeEventSend);
  });

  it("handles config overrides", () => {
    turbine.environment.stage = "development";
    getConfigOverrides.and.returnValue({
      com_adobe_target: { propertyToken: "development-property-token" }
    });
    build();
    const { edgeConfigOverrides } = alloy1.calls.argsFor(0)[1];
    expect(edgeConfigOverrides).toEqual({
      com_adobe_target: { propertyToken: "development-property-token" }
    });
  });
});
