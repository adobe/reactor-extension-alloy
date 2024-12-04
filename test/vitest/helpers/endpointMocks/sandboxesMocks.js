/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { vi } from "vitest";

export const single = vi.fn().mockResolvedValue({
  _embedded: {
    sandboxes: [
      {
        name: "prod",
        title: "Production",
        state: "active",
        type: "production",
        region: "VA7",
        isDefault: true,
        eTag: "1",
      },
    ],
  },
});

export const empty = vi.fn().mockResolvedValue({
  _embedded: {
    sandboxes: [],
  },
});
