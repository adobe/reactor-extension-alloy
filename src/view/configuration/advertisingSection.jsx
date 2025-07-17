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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import {
  Content,
  Flex,
  Heading,
  InlineAlert,
  Item,
  View,
} from "@adobe/react-spectrum";
import SectionHeader from "../components/sectionHeader";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FormikListView from "../components/formikReactSpectrum3/formikListView";
import fetchAdvertisers from "../utils/fetchAdvertisers";
import SINGLE_DATA_ELEMENT_REGEX from "../constants/singleDataElementRegex";
import { object, lazy, string, array } from "yup";

const getDefaultSettings = () => ({
  advertiserIds: [],
  id5PartnerId: "",
  rampIdJSPath: "",
});

export const bridge = {
  getInstanceDefaults: () => ({
    advertising: getDefaultSettings(),
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    if (!instanceSettings.advertising) {
      return bridge.getInstanceDefaults();
    }

    const advertising = Object.keys(getDefaultSettings()).reduce(
      (acc, k) => {
        if (instanceSettings.advertising[k] !== undefined) {
          acc[k] = instanceSettings.advertising[k];
        } else {
          acc[k] = getDefaultSettings()[k];
        }

        return acc;
      },
      {},
    );
    return { advertising };
  },
  getInstanceSettings: ({ instanceValues, components }) => {
    const instanceSettings = {};

    if (components.advertising) {
      const {
        advertising: { advertiserIds, id5PartnerId, rampIdJSPath },
      } = instanceValues;
      const advertising = {};

      if (advertiserIds && advertiserIds.length > 0) {
        advertising.advertiserIds = advertiserIds;
      }
      if (id5PartnerId !== "") {
        advertising.id5PartnerId = id5PartnerId;
      }
      if (rampIdJSPath !== "") {
        advertising.rampIdJSPath = rampIdJSPath;
      }

      if (Object.keys(advertising).length > 0) {
        instanceSettings.advertising = advertising;
      }
    }

    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    advertising: object().when("$components.advertising", {
      is: true,
      then: (schema) =>
        schema.shape({
          advertiserIds: array().of(string()).nullable(),
          id5PartnerId: lazy((value) =>
            typeof value === "string" && value.includes("%")
              ? string()
                  .matches(SINGLE_DATA_ELEMENT_REGEX, {
                    message: "Please enter a valid data element.",
                    excludeEmptyString: true,
                  })
                  .nullable()
              : string().nullable(),
          ),
          rampIdJSPath: lazy((value) =>
            typeof value === "string" && value.includes("%")
              ? string()
                  .matches(SINGLE_DATA_ELEMENT_REGEX, {
                    message: "Please enter a valid data element.",
                    excludeEmptyString: true,
                  })
                  .nullable()
              : string().nullable(),
          ),
        }),
      otherwise: (schema) => schema.nullable().strip(),
    }),
  }),
};

const AdvertisingSection = ({ instanceFieldName, initInfo }) => {
  const [{ value: advertisingComponentEnabled }] = useField(
    "components.advertising",
  );
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertisersData = async () => {
      if (!advertisingComponentEnabled || !initInfo) return;

      setLoading(true);
      setError(null);

      try {
        const {
          company: { orgId },
          tokens: { imsAccess },
        } = initInfo;

        const response = await fetchAdvertisers({
          orgId,
          imsAccess,
          signal: null,
        });

        const advertisersList =
          response?.items || response?.data || response || [];
        setAdvertisers(advertisersList);
      } catch (e) {
        console.error("Failed to fetch advertisers:", e);
        setError(e?.message || "Failed to load advertisers");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisersData();
  }, [advertisingComponentEnabled, initInfo]);

  const disabledView = (
    <View width="size-6000">
      <InlineAlert variant="info">
        <Heading>Adobe Advertising component disabled</Heading>
        <Content>
          The Adobe Advertising custom build component is disabled. Enable it
          above to configure Adobe Advertising settings.
        </Content>
      </InlineAlert>
    </View>
  );

  return (
    <>
      <SectionHeader learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/advertising/overview.html">
        AdobeAdvertising
      </SectionHeader>
      {advertisingComponentEnabled ? (
        <FormElementContainer>
          <Flex direction="column" gap="size-250">
            {error ? (
              <InlineAlert variant="negative">
                <Heading>Failed to load advertisers</Heading>
                <Content>{error}</Content>
              </InlineAlert>
            ) : (
              <FormikListView
                data-test-id="advertiserIdsField"
                label="Advertisers"
                description="Select one or more advertisers for targeting."
                name={`${instanceFieldName}.advertising.advertiserIds`}
                width="size-5000"
                height="size-3000"
                items={advertisers}
                getKey={(advertiser) => advertiser.advertiser_id}
                getLabel={(advertiser) => advertiser.advertiser_name}
                loadingState={loading ? "loading" : "idle"}
                isDisabled={loading || !!error}
                overflowMode="wrap"
              />
            )}
          </Flex>
          <Flex direction="row" gap="size-250">
            <DataElementSelector>
              <FormikTextField
                data-test-id="id5PartnerIdField"
                label="ID5 Partner ID"
                name={`${instanceFieldName}.advertising.id5PartnerId`}
                description="Enter the ID5 Partner ID for advertising identity resolution."
                width="size-5000"
                allowsCustomValue
              />
            </DataElementSelector>
          </Flex>
          <Flex direction="row" gap="size-250">
            <DataElementSelector>
              <FormikTextField
                data-test-id="rampIdJSPathField"
                label="RampID JS Path"
                name={`${instanceFieldName}.advertising.rampIdJSPath`}
                description="Enter the RampID JavaScript path for cross-device identity resolution and advertising use cases."
                width="size-5000"
                allowsCustomValue
              />
            </DataElementSelector>
          </Flex>
        </FormElementContainer>
      ) : (
        disabledView
      )}
    </>
  );
};

AdvertisingSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
};

export default AdvertisingSection;