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
import { string } from "yup";
import comboBox from "../forms/comboBox";
import instancePicker from "../forms/instancePicker";
import form from "../forms/form";
import conditional from "../forms/conditional";
import renderForm from "../forms/renderForm";
import textField from "../forms/textField";
import mediaEventTypes from "./constants/mediaEventTypes";
import section from "../forms/section";
import fieldArray from "../forms/fieldArray";
import numberField from "../forms/numberField";
import dataElementSection from "../forms/dataElementSection";

const wrapGetInitialValues = getInitialValues => ({ initInfo }) => {
  const {
    eventType,
    playerId,
    onBeforeMediaEvent = "",
    instanceName,
    xdm = {}
  } = initInfo.settings || {};

  const { mediaCollection = {} } = xdm;
  const {
    sessionID = "",
    playhead,
    qoeDataDetails,
    advertisingDetails,
    chapterDetails,
    advertisingPodDetails,
    sessionDetails,
    errorDetails
  } = mediaCollection;

  let automaticSessionHandler = true;
  if (playhead !== undefined) {
    automaticSessionHandler = false;
  }

  return getInitialValues({
    initInfo: {
      ...initInfo,
      settings: {
        eventType,
        playerId,
        onBeforeMediaEvent,
        instanceName,
        automaticSessionHandler,
        sessionID,
        playhead,
        qoeDataDetails,
        chapterDetails,
        advertisingDetails,
        advertisingPodDetails,
        errorDetails,
        sessionDetails
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
    onBeforeMediaEvent,
    qoeDataDetails,
    chapterDetails,
    advertisingPodDetails,
    advertisingDetails,
    errorDetails,
    sessionDetails
  } = getSettings({ values });
  const settings = { eventType, instanceName };
  const mediaCollection = {};

  if (automaticSessionHandler) {
    settings.playerId = playerId;
    if (onBeforeMediaEvent) {
      settings.onBeforeMediaEvent = onBeforeMediaEvent;
    }
  } else {
    settings.playerId = playerId;
    mediaCollection.sessionID = sessionID;
    mediaCollection.playhead = playhead;
  }
  if (qoeDataDetails) {
    mediaCollection.qoeDataDetails = qoeDataDetails;
  }
  if (chapterDetails) {
    mediaCollection.chapterDetails = chapterDetails;
  }
  if (advertisingDetails) {
    mediaCollection.advertisingDetails = advertisingDetails;
  }
  if (advertisingPodDetails) {
    mediaCollection.advertisingPodDetails = advertisingPodDetails;
  }
  if (errorDetails) {
    mediaCollection.errorDetails = errorDetails;
  }
  if (sessionDetails) {
    mediaCollection.sessionDetails = sessionDetails;
  }

  settings.xdm = {
    eventType,
    mediaCollection
  };

  return settings;
};

const advertisingPodDetailsSection = section(
  {
    label: "Advertising Pod Details",
    name: "advertisingPodDetails",
    objectKey: "advertisingPodDetails",
    dataElementDescription:
      "Enter the data element that returns advertising pod details."
  },
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
const chapterSection = dataElementSection(
  {
    label: "Chapter details",
    name: "chapterDetails",
    objectKey: "chapterDetails",
    dataElementDescription:
      "Enter the data element that returns chapter details object."
  },
  [
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
  ]
);
const advertisingDetailsSection = dataElementSection(
  {
    label: "Advertising Details",
    name: "advertisingDetails",
    dataElementDescription:
      "This should resolve to an object containing advertising details.",
    objectKey: "advertisingDetails"
  },
  [
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
  ]
);
const errorDetailsSection = dataElementSection(
  {
    label: "Error Details",
    name: "errorDetails",
    dataElementDescription:
      "This should resolve to an object containing error details.",
    objectKey: "errorDetails"
  },
  [
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
  ]
);
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
const sessionDetailsSection = dataElementSection(
  {
    label: "Media session details",
    name: "sessionDetails",
    dataElementDescription:
      "This should resolve to an object containing session details.",
    objectKey: "sessionDetails"
  },
  [
    textField({
      name: "channel",
      label: "Channel",
      isRequired: true,
      description:
        "Distribution Station/Channels where the content is played. Any string value is accepted here."
    }),
    comboBox({
      name: "contentType",
      label: "Content type",
      isRequired: true,
      description:
        "Enter the content type of the media session. Select a predefined value or enter a custom value.",
      dataElementDescription:
        "Enter a data element that resolves to a content type.",
      items: [
        { value: "vod", label: "Video-on-demand" },
        { value: "live", label: "Live streaming" },
        { value: "linear", label: "Linear playback of the media asset" },
        { value: "ugc", label: "User-generated content" },
        { value: "dvod", label: "Downloaded video-on-demand" },
        { value: "radio", label: "Radio show" },
        { value: "podcast", label: "Podcast" },
        { value: "audiobook", label: "Audiobook" },
        { value: "song", label: "Song" }
      ],
      allowsCustomValue: true
    }),
    textField({
      name: "playerName",
      label: "Content player name",
      isRequired: true,
      description: "Name of the media player."
    }),
    textField({
      name: "length", // integer
      label: "Clip Length/Runtime (seconds)",
      isRequired: true,
      description:
        "This is the maximum length (or duration) of the content being consumed (in seconds)." +
        "\nImportant: This property is used to compute several metrics, such as progress tracking metrics and Average Minute Audience. If this is not set, or not greater than zero, then these metrics are not available. \n" +
        "For Live media with an unknown duration, the value of 86400 is the default."
    }),
    textField({
      name: "name",
      label: "Content ID",
      isRequired: true,
      description:
        "Content ID of the content, which can be used to tie back to other industry / CMS IDs."
    }),
    textField({
      name: "adLoad",
      label: "Ad Load Type",
      isRequired: false,
      description: ""
    }),
    textField({
      name: "appVersion",
      label: "Application Version",
      isRequired: false,
      description:
        "The SDK version used by the player. This could have any custom value that makes sense for your player."
    }),
    textField({
      name: "artist",
      label: "Artist",
      isRequired: false,
      description: "Artist's name."
    }),
    textField({
      name: "rating",
      label: "Rating",
      isRequired: false,
      description: "Rating as defined by TV Parental Guidelines"
    }),
    textField({
      name: "show",
      label: "Show",
      isRequired: false,
      description:
        "Program/Series Name. Program Name is required only if the show is part of a series."
    }),
    textField({
      name: "episode",
      label: "Episode",
      isRequired: false,
      description: "Episode number."
    }),
    textField({
      name: "originator",
      label: "Originator",
      isRequired: false,
      description: "Creator of the content."
    }),
    textField({
      name: "firstAirDate",
      label: "First Air Date",
      isRequired: false,
      description:
        "The date when the content first aired on television. Any date format is acceptable, but Adobe recommends: YYYY-MM-DD."
    }),
    textField({
      name: "streamType", // add here types of stream audio - video
      label: "Stream type",
      isRequired: false,
      description: "Identifies the stream type."
    }),
    textField({
      name: "authorized",
      label: "Authorized",
      isRequired: false,
      description: "The user has been authorized via Adobe authentication."
    }),
    textField({
      name: "streamFormat",
      label: "Stream Format",
      isRequired: false,
      description: "Format of the stream (HD, SD)."
    }),
    textField({
      name: "station",
      label: "Station",
      isRequired: false,
      description: "Name / ID of the radio station."
    }),
    textField({
      name: "genre",
      label: "Genre",
      isRequired: false,
      description:
        "Type or grouping of content as defined by content producer. Values should be comma delimited in variable i" +
        "mplementation. In reporting, the list eVar will split each value into a line item, " +
        "with each line item receiving equal metrics weight."
    }),
    textField({
      name: "season",
      label: "Season",
      isRequired: false,
      description:
        "The season number the show belongs to. Season Series is required only if the show is part of a series."
    }),
    comboBox({
      name: "showType",
      label: "Show Type",
      description:
        "Type of content, expressed as an integer between 0 and 3. Select a predefined value or enter a custom value.",
      dataElementDescription:
        "Enter a data element that resolves to a show type.",
      items: [
        { value: "0", label: "Full episode" },
        { value: "1", label: "Preview/trailer" },
        { value: "2", label: "Clip" },
        { value: "3", label: "Other" }
      ],
      allowsCustomValue: true
    }),
    textField({
      name: "friendlyName",
      label: "Content name",
      isRequired: false,
      description:
        "This is the “friendly” (human-readable) name of the content."
    }),
    textField({
      name: "author",
      label: "Author",
      isRequired: false,
      description: "Name of the author (of an audiobook)."
    }),
    textField({
      name: "album",
      label: "Album",
      isRequired: false,
      description: "The author of the content."
    }),
    textField({
      name: "dayPart",
      label: "Day Part",
      isRequired: false,
      description:
        "A property that defines the time of the day when the content was broadcast or played. This could have " +
        "any value set as necessary by customers"
    }),
    textField({
      name: "label",
      label: "Label",
      isRequired: false,
      description: "Name of the record label."
    }),
    textField({
      name: "mvpd",
      label: "MVPD",
      isRequired: false,
      description: "MVPD provided via Adobe authentication."
    }),
    textField({
      name: "feed",
      label: "Feed type",
      isRequired: false,
      description: "Type of feed."
    }),
    textField({
      name: "assetID",
      label: "Asset ID",
      isRequired: false,
      description:
        "This is the unique identifier for the content of the media asset, such as the TV series episode identifier, " +
        "movie asset identifier, or live event identifier. Typically these IDs are derived from metadata authorities " +
        "such as EIDR, TMS/Gracenote, or Rovi. These identifiers can also be from other proprietary or in-house systems."
    }),
    textField({
      name: "publisher",
      label: "Publisher",
      isRequired: false,
      description: "Name of the audio content publisher"
    }),
    textField({
      name: "firstDigitalDate",
      label: "First Digital Date",
      isRequired: false,
      description:
        "The date when the content first aired on any digital channel or platform. Any date format is " +
        "acceptable but Adobe recommends: YYYY-MM-DD"
    }),
    textField({
      name: "network",
      label: "Network",
      isRequired: false,
      description: "The network/channel name"
    })
  ]
);

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
const qoeDataSection = dataElementSection(
  {
    label: "Quality of Experience data",
    name: "qoeDataDetails",
    dataElementDescription:
      "This should resolve to an object containing Quality of Experience data.",
    objectKey: "qoeDataDetails"
  },
  [
    textField({
      name: "bitrate",
      label: "Average bitrate (in kbps)",
      description:
        "The average bitrate (in kbps). The value is predefined buckets at 100kbps intervals. " +
        "The Average Bitrate is computed as a weighted average of all bitrate values related to the play " +
        "duration that occurred during a playback session.",
      isRequired: true
    }),
    textField({
      name: "droppedFrames",
      label: "Dropped Frames (Int)",
      description:
        "The number of dropped frames (Int). This value is computed as a sum of " +
        "all frames dropped during a playback session. "
    }),
    textField({
      name: "framesPerSecond",
      label: "Frames Per Second (in frames per second)",
      description:
        "The current value of the stream frame-rate (in frames per second). "
    }),
    textField({
      name: "timeToStart",
      label: "Time To Start (milliseconds)",
      description:
        "This value defaults to zero if you do not set it through the QoSObject. " +
        "You set this value in milliseconds. The value will be displayed in the time format (HH:MM:SS) "
    })
  ]
);

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
    textField({
      name: "playerId",
      label: "Player ID",
      isRequired: true,
      description: "Enter your player ID"
    }),
    numberField({
      name: "playhead",
      label: "Playhead",
      isRequired: true,
      description: "Enter the playhead",
      dataElementDescription: "This data element should resolve to a number."
    }),
    ...eventBasedDetailFormConditionals,
    qoeDataSection
  ]
);

renderForm(sendEventForm);
