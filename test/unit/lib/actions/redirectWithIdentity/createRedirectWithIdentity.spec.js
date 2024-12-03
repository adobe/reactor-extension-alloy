/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createRedirectWithIdentity from "../../../../../src/lib/actions/redirectWithIdentity/createRedirectWithIdentity";

describe("createRedirectWithIdentity", () => {
  let instanceManager;
  let instance;
  let document;
  let redirectWithIdentity;
  let event;
  let logger;
  let getConfigOverrides;

  beforeEach(() => {
    instanceManager = {
      getInstance: jest.fn(),
    };
    instance = jest.fn();
    instanceManager.getInstance.mockReturnValue(instance);
    instance.mockResolvedValue({ url: "newurl" });
    document = { location: "originalLocation" };
    getConfigOverrides = jest.fn();
    event = {
      nativeEvent: {
        preventDefault: jest.fn(),
      },
      element: {
        href: "originalHref",
      },
    };
    logger = {
      warn: jest.fn(),
    };

    redirectWithIdentity = createRedirectWithIdentity({
      instanceManager,
      document,
      logger,
      getConfigOverrides,
    });
  });

  it("returns resolved promise when instance isn't found", async () => {
    instanceManager.getInstance.mockReturnValue(undefined);
    const returnValue = await redirectWithIdentity(
      { instanceName: "myinstance" },
      event,
    );
    expect(returnValue).toBeUndefined();
    expect(instanceManager.getInstance).toHaveBeenCalledWith("myinstance");
    expect(document.location).toEqual("originalLocation");
    expect(event.nativeEvent.preventDefault).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });

  it("doesn't redirect when there is no nativeEvent", async () => {
    await redirectWithIdentity({ instanceName: "myinstance" }, {});
    expect(document.location).toEqual("originalLocation");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("doesn't redirect when there is no target on the nativeEvent", async () => {
    await redirectWithIdentity(
      { instanceName: "myinstance" },
      {
        nativeEvent: {},
      },
    );
    expect(document.location).toEqual("originalLocation");
    expect(logger.warn).toHaveBeenCalled();
  });

  it("proceeds with redirect when preventDefault isn't defined", async () => {
    await redirectWithIdentity(
      { instanceName: "myinstance" },
      {
        nativeEvent: {},
        element: {
          href: "originalHref",
        },
      },
    );
    expect(document.location).toBe("newurl");
    expect(logger.warn).not.toHaveBeenCalled();
    expect(instance).toHaveBeenCalledWith("appendIdentityToUrl", {
      url: "originalHref",
      edgeConfigOverrides: undefined,
    });
  });

  it("redirects", async () => {
    await redirectWithIdentity({ instanceName: "myinstance" }, event);
    expect(event.nativeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(document.location).toBe("newurl");
  });

  it("redirects with edge config overrides", async () => {
    const developmentEdgeConfigOverrides = {
      com_adobe_experience_platform: {
        datasets: {
          event: {
            datasetId: "6335faf30f5a161c0b4b1444",
          },
        },
      },
      com_adobe_analytics: {
        reportSuites: ["unifiedjsqeonly2"],
      },
      com_adobe_identity: {
        idSyncContainerId: 30793,
      },
      com_adobe_target: {
        propertyToken: "a15d008c-5ec0-cabd-7fc7-ab54d56f01e8",
      },
    };
    getConfigOverrides.mockReturnValue(developmentEdgeConfigOverrides);
    await redirectWithIdentity(
      {
        instanceName: "myinstance",
        edgeConfigOverrides: {
          development: developmentEdgeConfigOverrides,
        },
      },
      event,
    );
    expect(instance).toHaveBeenCalledWith("appendIdentityToUrl", {
      url: "originalHref",
      edgeConfigOverrides: developmentEdgeConfigOverrides,
    });
  });
});
