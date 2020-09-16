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

import * as autoPopulationSource from "./autoPopulationSource";
import * as contextKey from "./contextKey";

// fields that are always auto-populated
const ALWAYS = { autoPopulationSource: autoPopulationSource.ALWAYS };
// fields that may be specified as an option to the sendEvent command
const COMMAND = { autoPopulationSource: autoPopulationSource.COMMAND };
// fields that are auto-populated as part of the "device" context
const CONTEXT_DEVICE = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.DEVICE
};
// fields that are auto-populated as part of the "environment" context
const CONTEXT_ENVIRONMENT = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.ENVIRONMENT
};
// fields that are auto-populated as part of the "placeContext" context
const CONTEXT_PLACE_CONTEXT = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.PLACE_CONTEXT
};
// fields that are auto-populated as part of the "web" context
const CONTEXT_WEB = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.WEB
};

// These properties are applied to the form state in "getInitialFormState.js"
export default {
  _id: ALWAYS,
  timestamp: ALWAYS,
  implementationDetails: ALWAYS,
  "implementationDetails.name": ALWAYS,
  "implementationDetails.version": ALWAYS,
  "implementationDetails.environment": ALWAYS,

  eventType: COMMAND,
  eventMergeId: COMMAND,
  identityMap: COMMAND,

  device: CONTEXT_DEVICE,
  "device.screenHeight": CONTEXT_DEVICE,
  "device.screenWidth": CONTEXT_DEVICE,
  "device.screenOrientation": CONTEXT_DEVICE,
  environment: CONTEXT_ENVIRONMENT,
  "environment.type": CONTEXT_ENVIRONMENT,
  "environment.browserDetails": CONTEXT_ENVIRONMENT,
  "environment.browserDetails.viewportWidth": CONTEXT_ENVIRONMENT,
  "environment.browserDetails.viewportHeight": CONTEXT_ENVIRONMENT,
  placeContext: CONTEXT_PLACE_CONTEXT,
  "placeContext.localTime": CONTEXT_PLACE_CONTEXT,
  "placeContext.localTimezoneOffset": CONTEXT_PLACE_CONTEXT,
  web: CONTEXT_WEB,
  "web.webPageDetails": CONTEXT_WEB,
  "web.webPageDetails.URL": CONTEXT_WEB,
  "web.webReferrer": CONTEXT_WEB,
  "web.webReferrer.URL": CONTEXT_WEB
};
