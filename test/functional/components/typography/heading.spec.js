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
  title: "Heading component",
  htmlFileName: "heading.fixture.html"
});

const scenarios = [
  {
    testId: "sizeXxxl",
    tagName: "h1",
    classNames: ["spectrum-Heading--sizeXXXL"]
  },
  {
    testId: "sizeXxl",
    tagName: "h1",
    classNames: ["spectrum-Heading--sizeXXL"]
  },
  {
    testId: "sizeXl",
    tagName: "h1",
    classNames: ["spectrum-Heading--sizeXL"]
  },
  {
    testId: "sizeL",
    tagName: "h2",
    classNames: ["spectrum-Heading--sizeL"]
  },
  {
    testId: "sizeM",
    tagName: "h3",
    classNames: ["spectrum-Heading--sizeM"]
  },
  {
    testId: "sizeS",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS"]
  },
  {
    testId: "sizeXs",
    tagName: "h5",
    classNames: ["spectrum-Heading--sizeXS"]
  },
  {
    testId: "sizeXxs",
    tagName: "h6",
    classNames: ["spectrum-Heading--sizeXXS"]
  },
  {
    testId: "variantHeavy",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS", "spectrum-Heading--heavy"]
  },
  {
    testId: "variantLight",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS", "spectrum-Heading--light"]
  },
  {
    testId: "serif",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS", "spectrum-Heading--serif"]
  },
  {
    testId: "marginTop",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS"],
    style:
      "margin-top: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);"
  },
  {
    testId: "marginBottom",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS"],
    style:
      "margin-bottom: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);"
  },
  {
    testId: "noProps",
    tagName: "h4",
    classNames: ["spectrum-Heading--sizeS"]
  }
];

scenarios.forEach(({ testId, tagName, classNames = [], style }) => {
  test(`renders ${testId} scenario`, async () => {
    const selector = createTestIdSelector(testId);
    await t.expect(selector.tagName).eql(tagName);
    await t.expect(selector.textContent).eql("Test Heading");
    await t
      .expect(selector.classNames)
      .eql(["spectrum-Heading"].concat(classNames));
    if (style) {
      await t.expect(selector.getAttribute("style")).eql(style);
    } else {
      await t
        .expect(selector.getAttribute("style"))
        .notOk("Style found when no style was expected.");
    }
  });
});
