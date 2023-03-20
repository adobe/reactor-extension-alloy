import React from "react";
import { ActionButton, Flex } from "@adobe/react-spectrum";
import RemoveCircle from "@spectrum-icons/workflow/RemoveCircle";
import { FieldArray, useField } from "formik";
import PropTypes from "prop-types";
import SectionHeader from "../components/sectionHeader";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";
import FieldSubset from "../components/fieldSubset";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";

export const bridge = {
  // return formik state
  getInstanceDefaults: () => ({
    edgeConfigOverrides: {
      com_adobe_experience_platform: {
        datasets: {
          event: {
            datasetId: ""
          }
        }
      },
      com_adobe_analytics: {
        reportSuites: [""]
      },
      com_adobe_identity: {
        idSyncContainerId: ""
      },
      com_adobe_target: {
        propertyToken: ""
      }
    }
  }),
  // convert launch settings to formik state
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["edgeConfigOverrides"]
    });

    return instanceValues;
  },
  // convert formik state to launch settings
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};
    const propertyKeysToCopy = ["edgeConfigOverrides"];

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: propertyKeysToCopy
    });

    return instanceSettings;
  }
};

const ReportSuitesOverride = ({ instanceFieldName, rsids }) => {
  return (
    <FieldArray
      name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_analytics.reportSuites`}
    >
      {({ remove, push }) => (
        <>
          <Flex direction="column" gap="size-100">
            {rsids.map((rsid, index) =>
              index === 0 ? (
                <FormikTextField
                  data-test-id={`reportSuitesOverride.${index}`}
                  label="Report suites"
                  name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_analytics.reportSuites.${index}`}
                  width="size-5000"
                  key={index}
                />
              ) : (
                <Flex key={index} direction="row" alignItems="end">
                  <FormikTextField
                    data-test-id={`reportSuitesOverride.${index}`}
                    name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_analytics.reportSuites.${index}`}
                    width="size-5000"
                  />
                  <ActionButton
                    isQuiet
                    data-test-id={`removeReportSuite.${index}`}
                    aria-label={`Remove Report Suite #${index + 1}`}
                    onPress={() => remove(index)}
                  >
                    <RemoveCircle aria-label="Remove report suite" />
                  </ActionButton>
                </Flex>
              )
            )}
          </Flex>
          <ActionButton
            data-test-id="addReportSuite"
            marginTop="size-100"
            onPress={() => push("")}
          >
            Add Report Suite
          </ActionButton>
        </>
      )}
    </FieldArray>
  );
};

ReportSuitesOverride.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
  rsids: PropTypes.arrayOf(PropTypes.string).isRequired
};

const Overrides = ({ instanceFieldName }) => {
  const [{ value: instanceValues }] = useField(instanceFieldName);
  return (
    <>
      <SectionHeader>Datastream configuration overrides</SectionHeader>
      <FormElementContainer>
        <FieldSubset>
          <FormikTextField
            data-test-id="eventDatasetOverride"
            label="Event dataset"
            name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_experience_platform.datasets.event.datasetId`}
            description=""
            width="size-5000"
          />
          <FormikTextField
            data-test-id="idSyncContainerOverride"
            label="Third-party ID sync container"
            name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_identity.idSyncContainerId`}
            description=""
            width="size-5000"
          />
          <FormikTextField
            data-test-id="targetPropertyTokenOverride"
            label="Target property token"
            name={`${instanceFieldName}.edgeConfigOverrides.com_adobe_target.propertyToken`}
            description=""
            width="size-5000"
          />
          <ReportSuitesOverride
            instanceFieldName={instanceFieldName}
            rsids={
              instanceValues.edgeConfigOverrides.com_adobe_analytics
                .reportSuites
            }
          />
        </FieldSubset>
      </FormElementContainer>
    </>
  );
};

Overrides.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default Overrides;
