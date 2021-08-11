/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { t } from "testcafe";
import createComponentFixture from "../helpers/createComponentFixture";
import { createTestIdSelector } from "../../helpers/dataTestIdSelectors";

createComponentFixture({
  title: "Body component",
  htmlFileName: "body.fixture.html"
});

const scenarios = [
  {
    testId: "sizeXxxl",
    classNames: ["spectrum-Body--sizeXXXL"]
  },
  {
    testId: "sizeXxl",
    classNames: ["spectrum-Body--sizeXXL"]
  },
  {
    testId: "sizeXl",
    classNames: ["spectrum-Body--sizeXL"]
  },
  {
    testId: "sizeL",
    classNames: ["spectrum-Body--sizeL"]
  },
  {
    testId: "sizeM",
    classNames: ["spectrum-Body--sizeM"]
  },
  {
    testId: "sizeS",
    classNames: ["spectrum-Body--sizeS"]
  },
  {
    testId: "sizeXs",
    classNames: ["spectrum-Body--sizeXS"]
  },
  {
    testId: "sizeXxs",
    classNames: ["spectrum-Body--sizeXXS"]
  },
  {
    testId: "marginTop",
    classNames: ["spectrum-Body--sizeS"],
    style:
      "margin-top: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);"
  },
  {
    testId: "marginBottom",
    classNames: ["spectrum-Body--sizeS"],
    style:
      "margin-bottom: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);"
  },
  {
    testId: "noProps",
    classNames: ["spectrum-Body--sizeS"]
  }
];

scenarios.forEach(({ testId, classNames = [], style }) => {
  test(`renders ${testId} scenario`, async () => {
    const selector = createTestIdSelector(testId);
    await t.expect(selector.tagName).eql("p");
    await t.expect(selector.textContent).eql("Test Body");
    await t
      .expect(selector.classNames)
      .eql(["spectrum-Body"].concat(classNames));
    if (style) {
      await t.expect(selector.getAttribute("style")).eql(style);
    } else {
      await t
        .expect(selector.getAttribute("style"))
        .notOk("Style found when no style was expected.");
    }
  });
});
