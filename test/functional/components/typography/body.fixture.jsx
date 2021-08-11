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

import React from "react";
import render from "../helpers/renderComponentView";
import Body from "../../../../src/view/components/typography/body";

const BodyFixture = () => {
  return (
    <div>
      <Body data-test-id="sizeXxxl" size="XXXL">
        Test Body
      </Body>
      <Body data-test-id="sizeXxl" size="XXL">
        Test Body
      </Body>
      <Body data-test-id="sizeXl" size="XL">
        Test Body
      </Body>
      <Body data-test-id="sizeL" size="L">
        Test Body
      </Body>
      <Body data-test-id="sizeM" size="M">
        Test Body
      </Body>
      <Body data-test-id="sizeS" size="S">
        Test Body
      </Body>
      <Body data-test-id="sizeXs" size="XS">
        Test Body
      </Body>
      <Body data-test-id="sizeXxs" size="XXS">
        Test Body
      </Body>
      <Body data-test-id="serif" isSerif>
        Test Body
      </Body>
      <Body data-test-id="marginTop" marginTop="size-300">
        Test Body
      </Body>
      <Body data-test-id="marginBottom" marginBottom="size-300">
        Test Body
      </Body>
      <Body data-test-id="noProps">Test Body</Body>
    </div>
  );
};

render(BodyFixture);
