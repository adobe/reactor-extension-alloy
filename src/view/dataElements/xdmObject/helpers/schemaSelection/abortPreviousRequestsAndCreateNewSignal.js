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

let abortController;

/**
 * This is shared amongst schema selection async processes to
 * ensure that if a user selects a new sandbox or schema, that
 * prior async processes will be appropriately canceled in order
 * to avoid race conditions.
 */
const abortPreviousRequestsAndCreateSignal = () => {
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();

  return abortController.signal;
};

export default abortPreviousRequestsAndCreateSignal;
