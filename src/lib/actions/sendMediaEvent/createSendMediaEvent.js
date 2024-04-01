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
  trackMediaSession,
  mediaCollectionSessionStorage
}) => {
  return settings => {
    const {
      instanceName,
      eventType,
      playerId,
      ...createMediaEventSettings
    } = settings;
    const instance = instanceManager.getInstance(instanceName);

    if (!instance) {
      throw new Error(
        `Failed to send event for instance "${instanceName}". No matching instance was configured with this name.`
      );
    }

    if (!playerId) {
      throw new Error(
        "Failed to send media event. No playerId was provided in the settings."
      );
    }
    if (eventType === "media.sessionStart") {
      return trackMediaSession(settings);
    }
    const sessionID = mediaCollectionSessionStorage.get({ playerId });

    if (
      eventType === "media.sessionEnd" ||
      eventType === "media.sessionComplete"
    ) {
      mediaCollectionSessionStorage.remove({ playerId });
    }
    const { xdm = {} } = createMediaEventSettings;
    xdm.eventType = eventType;

    const options = { xdm };

    if (!sessionID) {
      options.playerId = playerId;
    } else {
      xdm.mediaCollection.sessionID = sessionID;
    }

    return instance("sendMediaEvent", options);
  };
};
