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
import injectWrapOnBeforeEventSend from "../../../../src/lib/instanceManager/injectWrapOnBeforeEventSend";

describe("injectWrapOnBeforeEventSend", () => {
  let turbine;
  let xdm;
  let data;
  let wrapOnBeforeEventSend;
  beforeEach(() => {
    turbine = { logger: { error: jasmine.createSpy() } };
    xdm = {
      implementationDetails: {
        name: "myname",
        version: "myversion"
      },
      a: "1"
    };
    data = {
      b: "2"
    };
    wrapOnBeforeEventSend = injectWrapOnBeforeEventSend({
      turbine,
      version: "reactorversion"
    });
  });

  it("works with no callback", () => {
    const subject = wrapOnBeforeEventSend(undefined);
    subject({ xdm, data });
    expect(xdm).toEqual({
      implementationDetails: {
        name: "myname/reactor",
        version: "myversion+reactorversion"
      },
      a: "1"
    });
    expect(data).toEqual({
      b: "2"
    });
    expect(turbine.logger.error).not.toHaveBeenCalled();
  });

  it("works with a callback", () => {
    const onBeforeEventSend = content => {
      content.xdm.c = "3";
      delete content.xdm.a;
      content.data.d = "4";
    };
    const subject = wrapOnBeforeEventSend(onBeforeEventSend);
    subject({ xdm, data });
    expect(xdm).toEqual({
      implementationDetails: {
        name: "myname/reactor",
        version: "myversion+reactorversion"
      },
      c: "3"
    });
    expect(data).toEqual({
      b: "2",
      d: "4"
    });
    expect(turbine.logger.error).not.toHaveBeenCalled();
  });

  it("works when the callback throws an exception", () => {
    const onBeforeEventSend = content => {
      content.xdm.c = "3";
      delete content.xdm.a;
      content.data.d = "4";
      throw Error("myerror");
    };
    const subject = wrapOnBeforeEventSend(onBeforeEventSend);
    subject({ xdm, data });
    expect(xdm).toEqual({
      implementationDetails: {
        name: "myname/reactor",
        version: "myversion+reactorversion"
      },
      a: "1"
    });
    expect(data).toEqual({
      b: "2"
    });
    expect(turbine.logger.error).toHaveBeenCalled();
  });
});
