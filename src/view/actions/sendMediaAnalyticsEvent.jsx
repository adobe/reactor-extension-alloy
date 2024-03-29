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
import fieldArray from "../forms/fieldArray";
import numberField from "../forms/numberField";
import dataElementSection from "../forms/dataElementSection";
import checkbox from "../forms/checkbox";
import objectArray from "../forms/objectArray";
import section from "../forms/section";
import dataElement from "../forms/dataElement";

const wrapGetInitialValues = getInitialValues => ({ initInfo }) => {
  const {
    eventType,
    playerId,
    automaticSessionHandler = false,
    getPlayerDetails = "",
    instanceName,
    xdm = {}
  } = initInfo.settings || {};

  const { mediaCollection = {} } = xdm;
  const {
    playhead,
    qoeDataDetails,
    advertisingDetails,
    chapterDetails,
    advertisingPodDetails,
    sessionDetails,
    errorDetails,
    customMetadata
  } = mediaCollection;

  return getInitialValues({
    initInfo: {
      ...initInfo,
      settings: {
        eventType,
        playerId,
        getPlayerDetails,
        instanceName,
        automaticSessionHandler,
        playhead,
        qoeDataDetails,
        chapterDetails,
        advertisingDetails,
        advertisingPodDetails,
        errorDetails,
        sessionDetails,
        customMetadata
      }
    }
  });
};

const wrapGetSettings = getSettings => ({ values }) => {
  const {
    instanceName,
    automaticSessionHandler = false,
    playerId,
    eventType,
    playhead,
    getPlayerDetails,
    qoeDataDetails,
    chapterDetails,
    advertisingPodDetails,
    advertisingDetails,
    errorDetails,
    sessionDetails,
    customMetadata
  } = getSettings({ values });

  const settings = {
    eventType,
    instanceName,
    playerId,
    getPlayerDetails,
    automaticSessionHandler
  };
  const mediaCollection = {};

  mediaCollection.playhead = playhead;

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

  if (customMetadata) {
    mediaCollection.customMetadata = customMetadata;
  }

  settings.xdm = {
    eventType,
    mediaCollection
  };

  return settings;
};

const advertisingPodDetailsSection = dataElementSection(
  {
    label: "Advertising pod details",
    name: "advertisingPodDetails",
    objectKey: "advertisingPodDetails",
    dataElementDescription:
      "Enter the data element that returns advertising pod details."
  },
  [
    textField({
      name: "friendlyName",
      label: "Ad break name",
      description: "The friendly name of the Ad Break."
    }),
    numberField({
      name: "offset",
      label: "Ad break offset (seconds)",
      isRequired: true,
      description: "The offset of the ad break inside the content, in seconds.",
      dataElementDescription:
        "This data element should resolve to a integer number."
    }),
    numberField({
      name: "index",
      label: "Ad break index",
      isRequired: true,
      description:
        "The index of the ad break inside the content starting at 1.",
      dataElementDescription:
        "This data element should resolve to a integer number."
    })
  ]
);
const customMetadataSection = section(
  {
    label: "Custom metadata",
    learnMoreUrl: "https://example.com"
  },
  [
    objectArray(
      {
        name: "customMetadata",
        singularLabel: "Scope",
        dataElementDescription:
          "Provide a data element that resolves to an object scope keys, and object values with keys: selector and actionType.",
        objectLabelPlural: "Scopes"
      },
      [
        textField({
          name: "name",
          label: "Key",
          isRequired: true,
          description: "Enter metadata key."
        }),
        textField({
          name: "value",
          label: "Value",
          isRequired: true,
          description: "Enter metadata value."
        })
      ]
    )
  ]
);
const chapterSection = dataElementSection(
  {
    label: "Chapter details",
    name: "chapterDetails",
    objectKey: "chapterDetails",
    dataElementDescription:
      "Enter the data element that returns a chapter details object."
  },
  [
    textField({
      name: "friendlyName",
      label: "Chapter name",
      description: "The name of the chapter and/or segment."
    }),
    numberField({
      name: "length",
      label: "Chapter length",
      isRequired: true,
      description: "The length of the chapter, in seconds.",
      dataElementDescription:
        "Enter the data element that returns a integer length."
    }),
    numberField({
      name: "index",
      label: "Chapter index",
      isRequired: true,
      description:
        "The position (index, integer) of the chapter inside the content.",
      dataElementDescription:
        "Enter the data element that returns a integer position (index, integer) of the chapter inside the content."
    }),
    numberField({
      name: "offset",
      label: "Chapter offset",
      isRequired: true,
      description:
        "The offset of the chapter inside the content (in seconds) from the start.",
      dataElementDescription:
        "Enter the data element that returns a integer number representing offset of the chapter inside the content (in seconds) from the start."
    })
  ]
);
const advertisingDetailsSection = dataElementSection(
  {
    label: "Advertising details",
    name: "advertisingDetails",
    dataElementDescription:
      "This should resolve to an object containing advertising details.",
    objectKey: "advertisingDetails"
  },
  [
    textField({
      name: "friendlyName",
      label: "Ad name",
      description: "Friendly name of the ad."
    }),
    textField({
      name: "name",
      label: "Ad ID",
      isRequired: true,
      description: "ID of the ad. (Any integer and/or letter combination)."
    }),
    numberField({
      name: "length",
      label: "Ad length (seconds)",
      isRequired: true,
      description: "Length of the video ad in seconds.",
      dataElementDescription:
        "This data element should resolve to a integer number."
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
    numberField({
      name: "podPosition",
      label: "Pod position",
      isRequired: true,
      description:
        "The position (index) of the ad inside the parent ad break. The first ad has index 0, the second ad has index 1 etc.",
      dataElementDescription:
        "This data element should resolve to a integer number."
    }),
    textField({
      name: "playerName",
      label: "Ad player name",
      isRequired: true,
      description: "The name of the player responsible for rendering the ad."
    })
  ]
);
const errorDetailsSection = dataElementSection(
  {
    label: "Error details",
    name: "errorDetails",
    dataElementDescription:
      "This should resolve to an object containing error details.",
    objectKey: "errorDetails"
  },
  [
    textField({
      name: "name",
      label: "Error name",
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
const stateUpdateDetailsSection = dataElementSection(
  { label: "State Update Details" },
  [
    fieldArray({
      name: "states",
      label: "States",
      singularLabel: "State",
      description: "Create an array of states that were updated.",
      dataElementDescription:
        "This data element should resolve to an array of states.",
      validationSchema: string()
    })
  ]
);
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
    numberField({
      name: "length", // integer
      label: "Clip Length/Runtime (seconds)",
      isRequired: true,
      description:
        "This is the maximum length (or duration) of the content being consumed (in seconds)." +
        "\nImportant: This property is used to compute several metrics, such as progress tracking metrics and Average Minute Audience. If this is not set, or not greater than zero, then these metrics are not available. \n" +
        "For Live media with an unknown duration, the value of 86400 is the default.",
      dataElementDescription: "This data element should resolve to a number."
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
      label: "Ad load type",
      isRequired: false,
      description: ""
    }),
    textField({
      name: "appVersion",
      label: "Application version",
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
      description: "Rating as defined by TV Parental Guidelines."
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
      label: "First air date",
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
      label: "Stream format",
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
      label: "Show type",
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
        "any value set as necessary by customers."
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
      description: "Name of the audio content publisher."
    }),
    textField({
      name: "firstDigitalDate",
      label: "First digital date",
      isRequired: false,
      description:
        "The date when the content first aired on any digital channel or platform. Any date format is " +
        "acceptable but Adobe recommends: YYYY-MM-DD."
    }),
    textField({
      name: "network",
      label: "Network",
      isRequired: false,
      description: "The network/channel name."
    })
  ]
);

const eventBasedDetailFormConditionals = [
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.adBreakStart"
    },
    [advertisingPodDetailsSection, customMetadataSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.adStart"
    },
    [advertisingDetailsSection, customMetadataSection]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.chapterStart"
    },
    [chapterSection, customMetadataSection]
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
    [sessionDetailsSection, customMetadataSection]
  )
];

const sendEventForm = form(
  {
    wrapGetInitialValues,
    wrapGetSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    comboBox({
      name: "eventType",
      label: "Media event type",
      description: "Select your media event type.",
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
      description: "Enter your player ID."
    }),
    conditional(
      {
        args: "eventType",
        condition: eventType => eventType === "media.sessionStart"
      },
      [
        checkbox({
          name: "automaticSessionHandler",
          label: "Handle media session automatically",
          description:
            "Choose 'Handle media session automatically' if you want the Web SDK to manage your media session and send necessary pings automatically. If you prefer to have more control and manually manage sending pings, you can deselect this option.",
          isRequired: false
        }),
        numberField({
          name: "playhead",
          label: "Playhead",
          isRequired: true,
          description: "Enter the playhead.",
          dataElementDescription:
            "This data element should resolve to a number."
        })
      ]
    ),
    conditional(
      {
        args: "eventType",
        condition: eventType => eventType !== "media.sessionStart"
      },
      [
        numberField({
          name: "playhead",
          label: "Playhead",
          isRequired: false,
          description: "Enter the playhead.",
          dataElementDescription:
            "This data element should resolve to a number."
        })
      ]
    ),
    ...eventBasedDetailFormConditionals,
    conditional(
      {
        args: "eventType",
        condition: eventType => eventType !== "media.bitrateChange"
      },
      [
        section(
          {
            label: "Quality of experience data"
          },
          [
            dataElement({
              name: "qoeDataDetails",
              label: "Quality of experience data",
              description:
                "This should resolve to an object containing Quality of Experience data."
            })
          ]
        )
      ]
    ),
    conditional(
      {
        args: "eventType",
        condition: eventType => eventType === "media.bitrateChange"
      },
      [
        section(
          {
            label: "Quality of experience data"
          },
          [
            dataElement({
              name: "qoeDataDetails",
              label: "Quality of experience data",
              isRequired: true,
              description:
                "This should resolve to an object containing Quality of Experience data."
            })
          ]
        )
      ]
    )
  ]
);

renderForm(sendEventForm);
