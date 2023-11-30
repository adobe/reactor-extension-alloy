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

import React from "react";
import PropTypes from "prop-types";
import { number, object, string } from "yup";
import SectionHeader from "../components/sectionHeader";
import FormElementContainer from "../components/formElementContainer";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FormikNumberField from "../components/formikReactSpectrum3/formikNumberField";

const getMediaCollection = () => {
  return {
    channel: "",
    playerName: "",
    version: "",
    adPingInterval: 10,
    mainPingInterval: 10
  };
};
export const bridge = {
  getInstanceDefaults: () => ({
    mediaCollection: getMediaCollection()
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    if (!instanceSettings.mediaCollection) {
      instanceSettings.mediaCollection = getMediaCollection();
    }

    return instanceSettings;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};
    const { mediaCollection } = instanceValues;

    if (
      mediaCollection.channel &&
      mediaCollection.playerName &&
      mediaCollection.version
    ) {
      instanceSettings.mediaCollection = mediaCollection;
    }
    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    mediaCollection: object().shape(
      {
        channel: string().when("playerName", {
          is: playerName => playerName,
          then: schema =>
            schema.required(
              "Please provide a channel name for Media Collection"
            )
        }),
        playerName: string().when("channel", {
          is: channel => channel,
          then: schema =>
            schema.required("Please provide a player name for Media Collection")
        }),
        adPingInterval: number().when(["channel", "playerName"], {
          is: (channel, playerName) => channel && playerName,
          then: schema =>
            schema
              .min(10, "The Ad Ping Interval must be greater than 10 seconds.")
              .default(10)
        }),
        mainPingInterval: number().when(["channel", "playerName"], {
          is: (channel, playerName) => channel && playerName,
          then: schema =>
            schema
              .min(
                10,
                "The Main Ping Interval must be greater than 10 seconds."
              )
              .default(10)
        })
      },
      ["channel", "playerName"]
    )
  })
};

const MediaCollectionSection = ({ instanceFieldName }) => {
  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/3fYDkfh">
        Media Collection
      </SectionHeader>
      <FormElementContainer>
        <FormikTextField
          data-test-id="mediaChannelField"
          label="Channel"
          name={`${instanceFieldName}.mediaCollection.channel`}
          description="Distribution Station/Channels or where the content is played. Any string value is accepted here."
          width="size-5000"
        />
        <FormikTextField
          data-test-id="mediaPlayerNameField"
          label="Player Name"
          name={`${instanceFieldName}.mediaCollection.playerName`}
          description="The Media Collection Player Name that will be used in every media session."
          width="size-5000"
        />
        <FormikTextField
          data-test-id="mediaVersionField"
          label="Application version"
          name={`${instanceFieldName}.mediaCollection.version`}
          description="The SDK version used by the player. This could have any custom value that makes sense for your player."
          width="size-5000"
        />
        <FormikNumberField
          data-test-id="mediaMainPingIntervalField"
          label="Main ping interval"
          name={`${instanceFieldName}.mediaCollection.mainPingInterval`}
          description="The ping interval frequency for main content."
          width="size-5000"
        />
        <FormikNumberField
          data-test-id="mediaAdPingIntervalField"
          label="Ad ping interval"
          name={`${instanceFieldName}.mediaCollection.adPingInterval`}
          description="The ping interval frequency for ad content."
          width="size-5000"
        />
      </FormElementContainer>
    </>
  );
};

MediaCollectionSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default MediaCollectionSection;
