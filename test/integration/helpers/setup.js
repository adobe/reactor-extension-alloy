/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// eslint-disable-next-line testing-library/no-manual-cleanup -- Vitest requires manual cleanup
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

import { server } from "./mocks/server";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test (important for test isolation)
afterEach(() => {
  cleanup();
  return server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());
