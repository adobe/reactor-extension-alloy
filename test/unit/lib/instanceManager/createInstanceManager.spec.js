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
  let runAlloy;
  let instanceManager;
  let mockWindow;

  const build = () => {
    instanceManager = createInstanceManager({
      turbine,
      window: mockWindow,
      runAlloy,
      orgId: "ABC@AdobeOrg"
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
    runAlloy = jasmine.createSpy().and.callFake(names => {
      names.forEach(name => {
        mockWindow[name] = jasmine
          .createSpy()
          .and.callFake((commandName, options) => {
            if (commandName === "configure") {
              options.reactorRegisterCreateEventMergeId(
                () => `randomEventMergeId`
              );
            }
          });
      });
    });
  });

  it("runs alloy", () => {
    build();
    expect(runAlloy).toHaveBeenCalledWith(["alloy1", "alloy2"]);
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
      reactorRegisterCreateEventMergeId: jasmine.any(Function)
    });
    expect(mockWindow.alloy2).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR456",
      debugEnabled: false,
      orgId: "DIFFERENTORG@AdobeOrg",
      reactorRegisterCreateEventMergeId: jasmine.any(Function)
    });
  });

  it("configures SDK instance with debugging enabled if Launch debugging is enabled", () => {
    turbine.debugEnabled = true;
    build();
    expect(mockWindow.alloy1).toHaveBeenCalledWith("configure", {
      edgeConfigId: "PR123",
      debugEnabled: true,
      orgId: "ABC@AdobeOrg",
      reactorRegisterCreateEventMergeId: jasmine.any(Function)
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
});
