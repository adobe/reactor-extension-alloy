/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

module.exports = ({
  instanceManager,
  mediaAnalyticsSessionCallbackStorage,
  mediaCollectionSessionStorage,
  wrapOnBeforeMediaEvent
}) => settings => {
  const { instanceName, ...createMediaSessionSettings } = settings;
  const instance = instanceManager.getInstance(instanceName);

  const options = { xdm: createMediaSessionSettings.xdm };
  if (
    createMediaSessionSettings.playerId &&
    createMediaSessionSettings.onBeforeMediaEvent
  ) {
    options.playerId = createMediaSessionSettings.playerId;
    options.onBeforeMediaEvent = wrapOnBeforeMediaEvent(
      createMediaSessionSettings.onBeforeMediaEvent
    );
  }

  return instance("createMediaSession", options)
    .then(result => {
      const { sessionId } = result;
      const playerId = options.playerId;
      const eventDetails = {
        playerId,
        sessionId
      };
      mediaCollectionSessionStorage.add({
        playerId,
        sessionDetails: result.sessionId
      });

      mediaAnalyticsSessionCallbackStorage.triggerEvent(eventDetails);
    })
    .catch(error => {
      console.error("Error creating media session", error);
      throw error;
    });
};
