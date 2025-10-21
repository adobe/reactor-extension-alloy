/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import deepAssign from "../utils/deepAssign";
import useForceRender from "../utils/useForceRender";
import { useFormikContext } from "formik";
import { useField } from "formik";
import { useEffect } from "react";
import useAbortPreviousRequestsAndCreateSignal from "../utils/useAbortPreviousRequestsAndCreateSignal";
import form from "./form";

export default function withContext({
  fetchContext,
  dependencies,
  ...otherArgs
}, children) {
  const { getInitialValues, getSettings, getValidationShape, Component } = form(
    otherArgs,
    children,
  );

  const parts = {
    getInitialValues: async ({ initInfo, context }) => {
      const initialValues = await getInitialValues({ initInfo, context });
      const values = dependencies.map(name => initialValues?.[name]);
      deepAssign(initialValues, await fetchContext({ signal: null, values, initInfo, context }));
      console.log("withContext getInitialValues", initialValues, context);
      return initialValues;
    },
    getSettings,
    getValidationShape,
    Component: ({ namePrefix = "", initInfo, context, ...otherArgs }) => {
      const formikContext = useFormikContext();
      const dependencyValues = dependencies.map(name => {
        const [{ value }] = useField(`${namePrefix}${name}`);
        return value;
      });
      const abortPreviousRequestsAndCreateSignal = useAbortPreviousRequestsAndCreateSignal();

      const forceRender = useForceRender();
      useEffect(() => {
        const fetch = async () => {
          const signal = abortPreviousRequestsAndCreateSignal();

          try {
            const values = await fetchContext({ signal, values: dependencyValues, initInfo, context });
            Object.keys(values).forEach(key => {
              formikContext.setFieldValue(`${namePrefix}${key}`, values[key]);
            })
            forceRender();
          } catch (error) {
            if (error.name === "AbortError") {
              return;
            }
            throw error;
          }
        }
        fetch();
      }, dependencyValues);

      return <Component namePrefix={namePrefix} context={context} {...otherArgs} />;
    }

  };
  return parts;
}
