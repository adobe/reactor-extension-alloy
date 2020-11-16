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
  let turbine;
  let baseCode;
  let core;
  let instanceManager;
  let mockWindow;
  let createEventMergeId;

  const build = () => {
    instanceManager = createInstanceManager({
      turbine,
      window: mockWindow,
      baseCode,
      core,
      orgId: "ABC@AdobeOrg",
      createEventMergeId
    });
  };

  beforeEach(() => {
    turbine = jasmine.createSpyObj({
      getExtensionSettings: {
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
      },
      onDebugChanged: undefined,
      buildInfo: { environment: "production" }
    });
    turbine.debugEnabled = false;
    mockWindow = {};
    baseCode = jasmine.createSpy().and.callFake(names => {
      names.forEach(name => {
        mockWindow[name] = jasmine.createSpy();
      });
    });
    core = jasmine.createSpy();
  });

  it("runs alloy", () => {
    build();
    expect(baseCode).toHaveBeenCalledWith(["alloy1", "alloy2"]);
    expect(core).toHaveBeenCalledWith();
  });

  it("creates an SDK instance for each configured instance", () => {
    build();
    expect(mockWindow.alloy1).toEqual(jasmine.any(Function));
    expect(mockWindow.alloy2).toEqual(jasmine.any(Function));
  });

  it("configures an SDK instance for each configured instance", () => {
    build();
    expect(mockWindow.alloy1).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR123",
      debugEnabled: false,
      orgId: "ABC@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function)
    });
    expect(mockWindow.alloy2).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR456",
      debugEnabled: false,
      orgId: "DIFFERENTORG@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function)
    });
  });

  it("configures SDK instance with debugging enabled if Launch debugging is enabled", () => {
    turbine.debugEnabled = true;
    build();
    expect(mockWindow.alloy1).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR123",
      debugEnabled: true,
      orgId: "ABC@AdobeOrg",
      onBeforeEventSend: jasmine.any(Function)
    });
  });

  it("toggles SDK debugging when Launch debugging is toggled", () => {
    const onDebugChangedCallbacks = [];
    turbine.onDebugChanged.and.callFake(callback => {
      onDebugChangedCallbacks.push(callback);
    });
    build();
    onDebugChangedCallbacks.forEach(callback => callback(true));
    expect(mockWindow.alloy1).toHaveBeenCalledWith("setDebug", {
      enabled: true
    });
    onDebugChangedCallbacks.forEach(callback => callback(false));
    expect(mockWindow.alloy1).toHaveBeenCalledWith("setDebug", {
      enabled: false
    });
  });

  it("returns instance by name", () => {
    build();
    const instance = instanceManager.getInstance("alloy2");
    expect(instance).toBe(mockWindow.alloy2);
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
    turbine.buildInfo.environment = "staging";
    build();
    expect(mockWindow.alloy1.calls.argsFor(0)[1].edgeConfigId).toEqual(
      "PR123:stage"
    );
    expect(mockWindow.alloy2.calls.argsFor(0)[1].edgeConfigId).toEqual("PR456");
  });

  it("handles a development environment", () => {
    turbine.buildInfo.environment = "development";
    build();
    expect(mockWindow.alloy1.calls.argsFor(0)[1].edgeConfigId).toEqual(
      "PR123:dev"
    );
    expect(mockWindow.alloy2.calls.argsFor(0)[1].edgeConfigId).toEqual("PR456");
  });

  it("sets an onBeforeEventSend that updates the implementation details", () => {
    build();
    const { onBeforeEventSend } = mockWindow.alloy1.calls.argsFor(0)[1];
    const xdm = {
      foo: "bar",
      implementationDetails: {
        name: "https://ns.adobe.com/experience/alloy",
        version: "1.2.3",
        environment: "browser"
      }
    };
    const data = {
      answer: 42
    };

    onBeforeEventSend({ xdm, data: {} });
    expect(xdm).toEqual({
      foo: "bar",
      implementationDetails: {
        name: "https://ns.adobe.com/experience/alloy/reactor",
        version: xdm.implementationDetails.version,
        environment: "browser"
      }
    });
    expect(xdm.implementationDetails.version).toMatch(/1\.2\.3\+\d+\.\d+\.\d+/);
    expect(data).toEqual({ answer: 42 });
  });
});
