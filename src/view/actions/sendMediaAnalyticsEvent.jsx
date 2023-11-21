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
import { string } from "yup";
import comboBox from "../forms/comboBox";
import instancePicker from "../forms/instancePicker";
import form from "../forms/form";
import conditional from "../forms/conditional";

import renderForm from "../forms/renderForm";
import textField from "../forms/textField";
import mediaEventTypes from "./constants/mediaEventTypes";
import checkbox from "../forms/checkbox";
import section from "../forms/section";
import fieldArray from "../forms/fieldArray";

const isNonEmptyObject = obj => {
  return Object.keys(obj).length > 0;
};
const wrapGetInitialValues = getInitialValues => ({ initInfo }) => {
  const { eventType, playerId, instanceName, xdm = {} } =
    initInfo.settings || {};
  const { mediaCollection = {} } = xdm;
  const { sessionID = "", playhead = "" } = mediaCollection;

  let automaticSessionHandler = false;
  if (playerId) {
    automaticSessionHandler = true;
  }
  return getInitialValues({
    initInfo: {
      ...initInfo,
      settings: {
        eventType,
        playerId,
        instanceName,
        automaticSessionHandler,
        sessionID,
        playhead
      }
    }
  });
};

const wrapGetSettings = getSettings => ({ values }) => {
  const {
    instanceName,
    automaticSessionHandler = true,
    playerId,
    eventType,
    sessionID,
    playhead,
    ...otherSettings
  } = getSettings({ values });

  const settings = { eventType, instanceName };
  const mediaCollection = {};

  if (automaticSessionHandler) {
    settings.playerId = playerId;
  } else {
    mediaCollection.sessionID = sessionID;
    mediaCollection.playhead = playhead;

    // adding QOE data
    const qoeDataDetails = {};

    if (otherSettings.bitrate) {
      qoeDataDetails.bitrate = otherSettings.bitrate;
    }
    if (otherSettings.droppedFrames) {
      qoeDataDetails.droppedFrames = otherSettings.droppedFrames;
    }
    if (otherSettings.framesPerSecond) {
      qoeDataDetails.framesPerSecond = otherSettings.framesPerSecond;
    }
    if (otherSettings.timeToStart) {
      qoeDataDetails.timeToStart = otherSettings.timeToStart;
    }
    if (isNonEmptyObject(qoeDataDetails)) {
      mediaCollection.qoeDataDetails = qoeDataDetails;
    }
  }
  if (eventType === "media.adBreakStart") {
    const advertisingPodDetails = {};
    if (otherSettings.friendlyName) {
      advertisingPodDetails.friendlyName = otherSettings.friendlyName;
    }
    if (otherSettings.offset) {
      advertisingPodDetails.offset = otherSettings.offset;
    }
    if (otherSettings.index) {
      advertisingPodDetails.index = otherSettings.index;
    }

    mediaCollection.advertisingPodDetails = advertisingPodDetails;
  }

  if (eventType === "media.adStart") {
    const advertisingDetails = {};
    if (otherSettings.friendlyName) {
      advertisingDetails.friendlyName = otherSettings.friendlyName;
    }
    if (otherSettings.name) {
      advertisingDetails.name = otherSettings.name;
    }
    if (otherSettings.advertiser) {
      advertisingDetails.advertiser = otherSettings.advertiser;
    }
    if (otherSettings.length) {
      advertisingDetails.length = otherSettings.length;
    }
    if (otherSettings.campaignID) {
      advertisingDetails.campaignID = otherSettings.campaignID;
    }
    if (otherSettings.creativeID) {
      advertisingDetails.creativeID = otherSettings.creativeID;
    }
    if (otherSettings.creativeURL) {
      advertisingDetails.creativeURL = otherSettings.creativeURL;
    }
    if (otherSettings.placementID) {
      advertisingDetails.placementID = otherSettings.placementID;
    }
    if (otherSettings.siteID) {
      advertisingDetails.siteID = otherSettings.siteID;
    }
    if (otherSettings.podPosition) {
      advertisingDetails.podPosition = otherSettings.podPosition;
    }
    if (otherSettings.playerName) {
      advertisingDetails.playerName = otherSettings.playerName;
    }

    mediaCollection.advertisingDetails = advertisingDetails;
  }

  if (eventType === "media.chapterStart") {
    const chapterDetails = {};
    if (otherSettings.friendlyName) {
      chapterDetails.friendlyName = otherSettings.friendlyName;
    }
    if (otherSettings.length) {
      chapterDetails.length = otherSettings.length;
    }
    if (otherSettings.index) {
      chapterDetails.index = otherSettings.index;
    }
    if (otherSettings.offset) {
      chapterDetails.offset = otherSettings.offset;
    }

    mediaCollection.chapterDetails = chapterDetails;
  }

  if (eventType === "media.error") {
    const errorDetails = {};

    if (otherSettings.name) {
      errorDetails.name = otherSettings.name;
    }
    if (otherSettings.source) {
      errorDetails.source = otherSettings.source;
    }

    mediaCollection.errorDetails = errorDetails;
  }

  settings.xdm = {
    eventType,
    mediaCollection
  };

  return settings;
};

const advertisingPodDetailsSection = section(
  { label: "Advertising Pod Details" },
  [
    textField({
      name: "friendlyName",
      label: "Friendly Name",
      description: "The friendly name of the Ad Break."
    }),
    textField({
      name: "offset",
      label: "Offset",
      isRequired: true,
      description: "The offset of the ad break inside the content, in seconds."
    }),
    textField({
      name: "index",
      label: "Index",
      isRequired: true,
      description: "The index of the ad break inside the content starting at 1."
    })
  ]
);
const chapterSection = section({ label: "Chapter details" }, [
  textField({
    name: "friendlyName",
    label: "Friendly name",
    description: "The name of the chapter and/or segment."
  }),
  textField({
    name: "length",
    label: "Length",
    isRequired: true,
    description: "The length of the chapter, in seconds."
  }),
  textField({
    name: "index",
    label: "Index",
    isRequired: true,
    description:
      "The position (index, integer) of the chapter inside the content."
  }),
  textField({
    name: "offset",
    label: "offset",
    isRequired: true,
    description:
      "The offset of the chapter inside the content (in seconds) from the start."
  })
]);
const advertisingDetailsSection = section({ label: "Advertising Details" }, [
  textField({
    name: "friendlyName",
    label: "Friendly Name",
    description: "Friendly name of the ad."
  }),
  textField({
    name: "name",
    label: "Name",
    isRequired: true,
    description: "ID of the ad. (Any integer and/or letter combination)"
  }),
  textField({
    name: "length",
    label: "Length",
    isRequired: true,
    description: "Enter index."
  }),
  textField({
    name: "advertiser",
    label: "Advertiser",
    description: "Company/Brand whose product is featured in the ad."
  }),
  textField({
    name: "campaignID",
    label: "Campaign ID",
    isRequired: true,
    description: "ID of the ad campaign."
  }),
  textField({
    name: "creativeID",
    label: "Creative ID",
    description: "ID of the ad creative."
  }),
  textField({
    name: "creativeURL",
    label: "Creative URL",
    description: "URL of the ad creative."
  }),
  textField({
    name: "placementID",
    label: "Placement ID",
    description: "Placement ID of the ad."
  }),
  textField({
    name: "siteID",
    label: "Site ID",
    description: "ID of the ad site."
  }),
  textField({
    name: "podPosition",
    label: "Pod Position",
    isRequired: true,
    description:
      "The position (index) of the ad inside the parent ad break. The first ad has index 0, the second ad has index 1 etc."
  }),
  textField({
    name: "playerName",
    label: "Player name",
    isRequired: true,
    description: "The name of the player responsible for rendering the ad."
  })
]);
const errorDetailsSection = section({ label: "Error Details" }, [
  textField({
    name: "name",
    label: "Error Name",
    isRequired: true,
    description: "Enter the error name."
  }),
  textField({
    name: "source",
    label: "Source",
    isRequired: true,
    description: "Enter the error source."
  })
]);
const stateUpdateDetailsSection = section({ label: "State Update Details" }, [
  fieldArray({
    name: "states",
    label: "States",
    singularLabel: "State",
    description: "Create an array of states that were updated.",
    dataElementDescription:
      "This data element should resolve to an array of states.",
    validationSchema: string()
  })
]);
const sessionDetailsSection = section({ label: "Media Session details" }, []);

const eventBasedDetailFormConditionals = [
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.adBreakStart"
    },
    [advertisingPodDetailsSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.adStart"
    },
    [advertisingDetailsSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.chapterStart"
    },
    [chapterSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.error"
    },
    [errorDetailsSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.statesUpdate"
    },
    [stateUpdateDetailsSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.sessionStart"
    },
    [sessionDetailsSection]
  )
];

const qoeDataSection = section({ label: "Quality of Experience data" }, [
  textField({
    name: "bitrate",
    label: "Bitrate",
    description: "Enter bitrate."
  }),
  textField({
    name: "droppedFrames",
    label: "Dropped Frames",
    description: "Enter dropped frames."
  }),
  textField({
    name: "framesPerSecond",
    label: "Frames Per Second",
    description: "Enter Frames Per Second."
  }),
  textField({
    name: "timeToStart",
    label: "Time To Start",
    description: "Enter Time To Start."
  })
]);

const sendEventForm = form(
  {
    wrapGetInitialValues,
    wrapGetSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    comboBox({
      name: "eventType",
      label: "Media Event Type",
      description: "Select your media event type",
      isRequired: true,
      items: Object.keys(mediaEventTypes).reduce((items, key) => {
        items.push({ value: key, label: mediaEventTypes[key] });
        return items;
      }, [])
    }),
    checkbox({
      name: "automaticSessionHandler",
      label: "Handle Media Session automatically.",
      description:
        "Check this to let Web SDK to retrieve the playHead, session, QOE data by using the PlayerID bellow.",
      defaultValue: true
    }),
    conditional(
      {
        args: "automaticSessionHandler",
        condition: automaticSessionHandler => automaticSessionHandler === true
      },
      [
        textField({
          name: "playerId",
          label: "Player ID",
          isRequired: true,
          description: "Enter your player ID"
        }),
        ...eventBasedDetailFormConditionals
      ]
    ),
    conditional(
      {
        args: "automaticSessionHandler",
        condition: automaticSessionHandler => automaticSessionHandler === false
      },
      [
        textField({
          name: "sessionID",
          label: "Session ID",
          isRequired: true,
          description: "The sessionID generated on sessionStart."
        }),
        textField({
          name: "playhead",
          label: "Playhead",
          isRequired: true,
          description: "Enter current playhead."
        }),
        ...eventBasedDetailFormConditionals,
        qoeDataSection
      ]
    )
  ]
);

renderForm(sendEventForm);
