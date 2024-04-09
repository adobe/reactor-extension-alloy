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

module.exports = ({
  instanceManager,
  mediaCollectionSessionStorage
}) => settings => {
  const { instanceName, automaticSessionHandler, playerId, xdm } = settings;
  const instance = instanceManager.getInstance(instanceName);

  const options = { xdm };
  const sessionDetails = mediaCollectionSessionStorage.get({ playerId });

  if (sessionDetails && sessionDetails.sessionId) {
    // if we have a mapping in cache we resolve the promise and not start another session again
    return Promise.resolve();
  }

  if (automaticSessionHandler) {
    options.playerId = playerId;

    options.getPlayerDetails = () => {
      return {
        playhead: xdm.mediaCollection.playhead || 0,
        qoeDataDetails: xdm.mediaCollection.qoeDataDetails || undefined
      };
    };
  }

  return instance("createMediaSession", options)
    .then(result => {
      const { sessionId } = result;

      if (sessionId) {
        mediaCollectionSessionStorage.add({
          playerId,
          sessionDetails: {
            automaticSessionHandler,
            sessionId,
            playhead: xdm.mediaCollection.playhead,
            qoeDataDetails: xdm.mediaCollection.qoeDataDetails
          }
        });
      }
    })
    .catch(error => {
      console.error("Error creating media session", error);
      throw error;
    });
};
