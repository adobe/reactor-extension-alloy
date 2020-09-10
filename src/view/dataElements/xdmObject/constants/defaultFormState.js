import * as autoPopulationSource from "./autoPopulationSource";
import * as contextKey from "./contextKey";

const ALWAYS = { autoPopulationSource: autoPopulationSource.ALWAYS };
const COMMAND = { autoPopulationSource: autoPopulationSource.COMMAND };
const CONTEXT_DEVICE = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.DEVICE
};
const CONTEXT_ENVIRONMENT = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.ENVIRONMENT
};
const CONTEXT_PLACE_CONTEXT = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.PLACE_CONTEXT
};
const CONTEXT_WEB = {
  autoPopulationSource: autoPopulationSource.CONTEXT,
  contextKey: contextKey.WEB
};

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
