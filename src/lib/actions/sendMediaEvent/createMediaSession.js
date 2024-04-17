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

module.exports =
  ({ instanceManager, mediaCollectionSessionStorage, satelliteApi }) =>
  settings => {
    const { instanceName, handleMediaSessionAutomatically, playerId, xdm } =
      settings;
    const instance = instanceManager.getInstance(instanceName);

    const options = { xdm };
    const sessionDetails = mediaCollectionSessionStorage.get({ playerId });

    if (sessionDetails && sessionDetails.sessionId) {
      return Promise.resolve();
    }
    const { playhead, qoeDataDetails } = xdm.mediaCollection;
    // eslint-disable-next-line no-underscore-dangle
    const playheadVar = window._satellite.getVar(playhead);
    xdm.mediaCollection.playhead = playheadVar;

    if (qoeDataDetails) {
      // eslint-disable-next-line no-underscore-dangle
      const qoeDataDetailsVar = window._satellite.getVar(qoeDataDetails);
      xdm.mediaCollection.qoeDataDetails = qoeDataDetailsVar;
    }

    if (handleMediaSessionAutomatically) {
      options.playerId = playerId;

      options.getPlayerDetails = () => {
        // eslint-disable-next-line no-underscore-dangle
        const playerDetails = {
          // eslint-disable-next-line no-underscore-dangle
          playhead: window._satellite.getVar(playhead)
        };

        if (qoeDataDetails) {
          // eslint-disable-next-line no-underscore-dangle
          playerDetails.qoeDataDetails = satelliteApi.getVar(qoeDataDetails);
        }

        return playerDetails;
      };
    }

    return instance("createMediaSession", options)
      .then(result => {
        const { sessionId } = result;

        if (sessionId) {
          mediaCollectionSessionStorage.add({
            playerId,
            sessionDetails: {
              handleMediaSessionAutomatically,
              sessionId,
              playhead,
              qoeDataDetails
            }
          });
        }
      })
      .catch(error => {
        console.error("Error creating media session", error);
        throw error;
      });
  };
