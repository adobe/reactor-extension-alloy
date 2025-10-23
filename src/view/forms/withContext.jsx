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
import { useField } from "formik";
import useChanged from "../utils/useChanged";
import useAbortPreviousRequestsAndCreateSignal from "../utils/useAbortPreviousRequestsAndCreateSignal";

export default function withContext({
  updateContext,
  dependencies,
}) {

  const parts = {
    initializeContext: async ({ initInfo, context, values }) => {
      const dependencyValues = dependencies.map(name => {
        const parts = name.split(".");
        return parts.reduce((acc, part) => {
          return acc?.[part];
        }, values);
      });
      console.log("initializeContext", values, dependencies, dependencyValues);
      await updateContext({ signal: null, dependencies: dependencyValues, initInfo, context });
      console.log("initializeContext done", context);
    },
    Component: ({ namePrefix = "", initInfo, context, forceRender }) => {
      const dependencyValues = dependencies.map(name => {
        const [{ value }] = useField(`${namePrefix}${name}`);
        return value;
      });
      const abortPreviousRequestsAndCreateSignal = useAbortPreviousRequestsAndCreateSignal();

      useChanged(() => {
        const run = async () => {
          const signal = abortPreviousRequestsAndCreateSignal();

          try {
            await updateContext({ signal, values: dependencyValues, initInfo, context });
            forceRender();
          } catch (error) {
            if (error.name === "AbortError") {
              return;
            }
            throw error;
          }
        }
        run();
      }, dependencyValues);

      return null;
    }

  };
  return parts;
}
