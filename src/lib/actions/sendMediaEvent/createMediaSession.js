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
  mediaCollectionSessionStorage,
  wrapOnBeforeMediaEvent
}) => settings => {
  const { instanceName, ...createMediaSessionSettings } = settings;
  const instance = instanceManager.getInstance(instanceName);

  const options = { xdm: createMediaSessionSettings.xdm };
  if (
    createMediaSessionSettings.playerId &&
    createMediaSessionSettings.getPlayerDetails
  ) {
    options.playerId = createMediaSessionSettings.playerId;
    options.getPlayerDetails = wrapOnBeforeMediaEvent(
      createMediaSessionSettings.getPlayerDetails
    );
  }
  return instance("createMediaSession", options)
    .then(result => {
      const { sessionId } = result;
      const playerId = createMediaSessionSettings.playerId;

      mediaCollectionSessionStorage.add({
        playerId,
        sessionDetails: sessionId
      });
    })
    .catch(error => {
      console.error("Error creating media session", error);
      throw error;
    });
};
