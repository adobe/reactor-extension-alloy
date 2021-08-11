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
import Heading from "../../../../src/view/components/typography/heading";

const HeadingFixture = () => {
  return (
    <div>
      <Heading data-test-id="sizeXxxl" size="XXXL">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeXxl" size="XXL">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeXl" size="XL">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeL" size="L">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeM" size="M">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeS" size="S">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeXs" size="XS">
        Test Heading
      </Heading>
      <Heading data-test-id="sizeXxs" size="XXS">
        Test Heading
      </Heading>
      <Heading data-test-id="variantHeavy" variant="heavy">
        Test Heading
      </Heading>
      <Heading data-test-id="variantLight" variant="light">
        Test Heading
      </Heading>
      <Heading data-test-id="serif" isSerif>
        Test Heading
      </Heading>
      <Heading data-test-id="marginTop" marginTop="size-300">
        Test Heading
      </Heading>
      <Heading data-test-id="marginBottom" marginBottom="size-300">
        Test Heading
      </Heading>
      <Heading data-test-id="noProps">Test Heading</Heading>
    </div>
  );
};

render(HeadingFixture);
