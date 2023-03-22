import { ActionButton, Button, Flex } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { FieldArray, useField } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { array, number, object, string } from "yup";
import copyPropertiesIfValueDifferentThanDefault from "../configuration/utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "../configuration/utils/copyPropertiesWithDefaultFallback";
import FieldSubset from "./fieldSubset";
import FormElementContainer from "./formElementContainer";
import FormikTextField from "./formikReactSpectrum3/formikTextField";
import SectionHeader from "./sectionHeader";

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

    if (
      instanceSettings.edgeConfigOverrides?.com_adobe_identity
        ?.idSyncContainerId
    ) {
      // Alloy, Konductor, and Blackbird expect this to be a number
      instanceSettings.edgeConfigOverrides.com_adobe_identity.idSyncContainerId = parseInt(
        instanceSettings.edgeConfigOverrides.com_adobe_identity
          .idSyncContainerId,
        10
      );
    }

    return instanceSettings;
  },
  formikStateValidationSchema: object({
    edgeConfigOverrides: object({
      com_adobe_experience_platform: object({
        datasets: object({
          event: object({
            datasetId: string()
          }),
          profile: object({
            datasetId: string()
          })
        })
      }),
      com_adobe_analytics: object({
        reportSuites: array(string())
      }),
      com_adobe_identity: object({
        idSyncContainerId: number()
          .positive()
          .integer()
      }),
      com_adobe_target: object({
        propertyToken: string()
      })
    })
  })
};

const ReportSuitesOverride = ({ prefix, rsids }) => {
  return (
    <FieldArray name={`${prefix}.com_adobe_analytics.reportSuites`}>
      {({ remove, push }) => (
        <>
          <Flex direction="column" gap="size-100">
            {rsids.map((rsid, index) => (
              <Flex key={index} direction="row">
                <FormikTextField
                  data-test-id={`reportSuitesOverride.${index}`}
                  label={index === 0 && "Report suites"}
                  name={`${prefix}.com_adobe_analytics.reportSuites.${index}`}
                  description={
                    index === rsids.length - 1 &&
                    "The IDs for the destination report suites in Adobe Analytics. The report suites set here override all those set in your datastream configuration."
                  }
                  width="size-5000"
                  key={index}
                />
                <ActionButton
                  isQuiet
                  isDisabled={rsids.length < 2}
                  marginTop={index === 0 && "size-300"}
                  data-test-id={`removeReportSuite.${index}`}
                  aria-label={`Remove report suite #${index + 1}`}
                  onPress={() => remove(index)}
                >
                  <Delete />
                </ActionButton>
              </Flex>
            ))}
          </Flex>
          <Button
            data-test-id="addReportSuite"
            variant="secondary"
            marginTop="size-100"
            onPress={() => push("")}
          >
            Add Report Suite
          </Button>
        </>
      )}
    </FieldArray>
  );
};

ReportSuitesOverride.propTypes = {
  prefix: PropTypes.string.isRequired,
  rsids: PropTypes.arrayOf(PropTypes.string).isRequired
};

const Overrides = ({ instanceFieldName, showHeader = false }) => {
  const prefix = instanceFieldName
    ? `${instanceFieldName}.edgeConfigOverrdides`
    : "edgeConfigOverrides";
  const [{ value }] = useField(instanceFieldName ?? "edgeConfigOverrides");
  const edgeConfigOverrides = value.edgeConfigOverrides ?? value;
  return (
    <>
      {showHeader && (
        <SectionHeader>Datastream Configuration Overrides</SectionHeader>
      )}
      <FormElementContainer>
        <FieldSubset>
          <FormikTextField
            data-test-id="eventDatasetOverride"
            label="Event dataset"
            name={`${prefix}.com_adobe_experience_platform.datasets.event.datasetId`}
            description="The ID for the destination event dataset in the Adobe Experience Platform. The dataset set here overrides the one set in your datastream configuration."
            width="size-5000"
          />
          <FormikTextField
            data-test-id="idSyncContainerOverride"
            label="Third-party ID sync container"
            name={`${prefix}.com_adobe_identity.idSyncContainerId`}
            inputMode="numeric"
            pattern={/\d+/}
            description="The ID for the destination third-party ID sync container in Adobe Audience Manager. The container set here overrides the one set in your datastream configuration."
            width="size-5000"
          />
          <FormikTextField
            data-test-id="targetPropertyTokenOverride"
            label="Target property token"
            name={`${prefix}.com_adobe_target.propertyToken`}
            description="The token for the destination property in Adobe Target. The token set here overrides the one set in your datastream configuration."
            width="size-5000"
          />
          <ReportSuitesOverride
            prefix={prefix}
            rsids={edgeConfigOverrides.com_adobe_analytics.reportSuites}
          />
        </FieldSubset>
      </FormElementContainer>
    </>
  );
};

Overrides.propTypes = {
  instanceFieldName: PropTypes.string,
  showHeader: PropTypes.bool
};

export default Overrides;
