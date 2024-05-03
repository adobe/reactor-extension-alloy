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
import { isEmptyArray } from "formik";
import comboBox from "../forms/comboBox";
import instancePicker from "../forms/instancePicker";
import form from "../forms/form";
import conditional from "../forms/conditional";
import renderForm from "../forms/renderForm";
import textField from "../forms/textField";
import mediaEventTypes from "./constants/mediaEventTypes";
import numberField from "../forms/numberField";
import dataElementSection from "../forms/dataElementSection";
import checkbox from "../forms/checkbox";
import objectArray from "../forms/objectArray";
import section from "../forms/section";
import dataElement from "../forms/dataElement";

const wrapGetInitialValues =
  getInitialValues =>
  ({ initInfo }) => {
    const {
      eventType,
      playerId,
      handleMediaSessionAutomatically = false,
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
      customMetadata,
      statesEnd,
      statesStart
    } = mediaCollection;

    return getInitialValues({
      initInfo: {
        ...initInfo,
        settings: {
          eventType,
          playerId,
          instanceName,
          handleMediaSessionAutomatically,
          playhead,
          qoeDataDetails,
          chapterDetails,
          advertisingDetails,
          advertisingPodDetails,
          errorDetails,
          sessionDetails,
          customMetadata,
          statesEnd,
          statesStart
        }
      }
    });
  };

const wrapGetSettings =
  getSettings =>
  ({ values }) => {
    const {
      instanceName,
      handleMediaSessionAutomatically = false,
      playerId,
      eventType,
      playhead,
      qoeDataDetails,
      statesEnd,
      statesStart,
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
      handleMediaSessionAutomatically
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

    if (!isEmptyArray(statesEnd)) {
      mediaCollection.statesEnd = statesEnd;
    }

    if (!isEmptyArray(statesStart)) {
      mediaCollection.statesStart = statesStart;
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
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/advertising-pod-details-collection",
    objectKey: "advertisingPodDetails",
    dataElementDescription:
      "Provide a data element that returns advertising pod details object."
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
      dataElementDescription: "Provide a data element that returns an integer."
    }),
    numberField({
      name: "index",
      label: "Ad break index",
      isRequired: true,
      description:
        "The index of the ad break inside the content starting at 1.",
      dataElementDescription: "Provide a data element that returns an integer."
    })
  ]
);
const customMetadataSection = section(
  {
    label: "Custom metadata",
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/custom-metadata-details-collection"
  },
  [
    objectArray(
      {
        name: "customMetadata",
        singularLabel: "Custom Metadata",
        dataElementDescription:
          "Provide a data element that resolves to an array of objects with properties 'name' and 'value'.",
        objectLabelPlural: "Custom Metadata"
      },
      [
        textField({
          name: "name",
          label: "Name",
          description: "Enter metadata name."
        }),
        textField({
          name: "value",
          label: "Value",
          description: "Enter metadata value."
        })
      ]
    )
  ]
);
const chapterSection = dataElementSection(
  {
    label: "Chapter details",
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/chapter-details-collection",
    name: "chapterDetails",
    objectKey: "chapterDetails",
    dataElementDescription:
      "Provide a data element that returns a chapter details object."
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
        "Provide a data element that returns a integer length."
    }),
    numberField({
      name: "index",
      label: "Chapter index",
      isRequired: true,
      description:
        "The position (index, integer) of the chapter inside the content.",
      dataElementDescription:
        "Provide a data element that returns the position of the chapter inside the content (index, integer)."
    }),
    numberField({
      name: "offset",
      label: "Chapter offset",
      isRequired: true,
      description:
        "The offset of the chapter inside the content (in seconds) from the start.",
      dataElementDescription:
        "Provide a data element that returns an integer representing offset of the chapter inside the content (in seconds) from the start."
    })
  ]
);
const advertisingDetailsSection = dataElementSection(
  {
    label: "Advertising details",
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/advertising-details-collection",
    name: "advertisingDetails",
    dataElementDescription:
      "Provide a data element that returns advertising details object.",
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
      dataElementDescription: "Provide a data element that returns an integer."
    }),
    textField({
      name: "advertiser",
      label: "Advertiser",
      description: "Company/brand whose product is featured in the ad."
    }),
    textField({
      name: "campaignID",
      label: "Campaign ID",
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
      dataElementDescription: "Provide a data element that returns an integer."
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
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/error-details-collection",
    dataElementDescription:
      "Provide a data element that returns an error details object.",
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
const stateUpdateDetailsSection = section({ label: "State Update Details" }, [
  objectArray(
    {
      name: "statesStart",
      label: "States started",
      learnMoreUrl:
        "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/list-of-states-start-collection",
      singularLabel: "State",
      description: "Create an array of states that started.",
      dataElementDescription:
        "Provide a data element that returns an array of states that started.",
      validationSchema: string()
    },
    [
      comboBox({
        name: "name",
        description: "Select or enter the state that started.",
        items: [
          { value: "fullScreen", label: "Full screen" },
          { value: "closedCaptioning", label: "Closed captioning" },
          { value: "mute", label: "Mute" },
          { value: "pictureInPicture", label: "Picture in picture" },
          { value: "inFocus", label: "In focus" }
        ],
        allowsCustomValue: true
      })
    ]
  ),
  objectArray(
    {
      name: "statesEnd",
      label: "States ended",
      learnMoreUrl:
        "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/list-of-states-end-collection",
      singularLabel: "State",
      description: "Create an array of states that ended.",
      dataElementDescription:
        "Provide a data element that returns an array of states that ended.",
      validationSchema: string()
    },
    [
      comboBox({
        name: "name",
        description: "Select or enter the state that ended.",
        items: [
          { value: "fullScreen", label: "Full screen" },
          { value: "closedCaptioning", label: "Closed captioning" },
          { value: "mute", label: "Mute" },
          { value: "pictureInPicture", label: "Picture in picture" },
          { value: "inFocus", label: "In focus" }
        ],
        allowsCustomValue: true
      })
    ]
  )
]);
const sessionDetailsSection = dataElementSection(
  {
    label: "Media session details",
    learnMoreUrl:
      "https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-types/session-details-collection",
    name: "sessionDetails",
    dataElementDescription:
      "Provide a data element that returns a session details object.",
    objectKey: "sessionDetails"
  },
  [
    textField({
      name: "channel",
      label: "Channel",
      isRequired: true,
      description:
        "Distribution station or channels where the content is played. Any string value is accepted here."
    }),
    comboBox({
      name: "contentType",
      label: "Content type",
      isRequired: true,
      description:
        "Enter the content type of the media session. Select a predefined value or enter a custom value.",
      dataElementDescription:
        "Provide a data element that returns to a content type.",
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
      label: "Clip length/runtime (seconds)",
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
        "Program/series name. Program name is required only if the show is part of a series."
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
        "Type or grouping of content as defined by content producer. Values should be comma delimited in variable " +
        "implementation. In reporting, the list eVar will split each value into a line item, " +
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
        "Provide a data element that returns a show type.",
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
    [advertisingPodDetailsSection]
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
    [
      sessionDetailsSection,
      customMetadataSection,
      dataElement({
        name: "qoeDataDetails",
        label: "Quality of Experience data",
        description:
          "This data element should resolve to a Quality of Experience object. This object should contain the following " +
          "properties: 'bitrate', 'droppedFrames', 'framesPerSecond', 'timeToStart'. These properties represent " +
          "the bitrate in kbps, the number of dropped frames, the frames per second, and the time to start in " +
          "milliseconds, respectively. You can use a Media:Quality of Experience data element or a custom code " +
          "data element to provide this information.",
        tokenize: false
      })
    ]
  ),
  conditional(
    {
      args: "eventType",
      condition: eventType => eventType === "media.bitrateChange"
    },
    [
      dataElement({
        name: "qoeDataDetails",
        label: "Quality of experience data",
        description:
          "This data element should resolve to a Quality of Experience object. This object should contain the following " +
          "properties: 'bitrate', 'droppedFrames', 'framesPerSecond', 'timeToStart'. These properties represent " +
          "the bitrate in kbps, the number of dropped frames, the frames per second, and the time to start in " +
          "milliseconds, respectively. You can use a Media:Quality of Experience data element or a custom code " +
          "data element to provide this information.",
        tokenize: false
      })
    ]
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
          name: "handleMediaSessionAutomatically",
          label: "Handle media session automatically",
          description:
            "Choose 'Handle media session automatically' if you want the Web SDK to send necessary pings automatically. If you prefer to have more control and manually manage sending pings, you can deselect this option.",
          isRequired: false
        }),
        dataElement({
          name: "playhead",
          label: "Playhead",
          isRequired: true,
          description: "This data element should resolve to a number.",
          tokenize: false
        })
      ]
    ),
    ...eventBasedDetailFormConditionals
  ]
);

renderForm(sendEventForm);
