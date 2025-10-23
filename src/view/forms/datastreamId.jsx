import React from "react";
import PropTypes from "prop-types";
import { useField } from "formik";
import comboBox from "../components/comboBox";
import withContext from "./withContext";

export default function datastreamId({ prefix = "", isExtensionConfiguration = false }) {

  const sandboxName = prefix ? `${prefix}Sandbox` : "sandbox";
  const edgeConfigIdsName = prefix ? `${prefix}EdgeConfigId` : "edgeConfigId";

  const sandboxUpdateContext = async ({ context, initInfo, signal }) => {
    context.sandboxes = await fetchSandboxes({
      orgId: initInfo.company.orgId,
      imsAccess: initInfo.token.imsAccess,
      signal,
    });
  };

  return form({},[
    withContext({
      updateContext: sandboxUpdateContext,
      dependencies: ["instanceName"]
    }),
    withContext({
      updateContext: edgeConfigIdsUpdateContext,
      dependencies: [sandboxName]
    }),
    comboBox({
      name: sandboxName,
      label: ""
      items: context => context.sandboxes
    })
  ]);
}
