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
import path from "path";
import fs from "fs";
import getContainer from "@adobe/reactor-sandbox/src/tasks/helpers/getContainer";
import appendScript from "./appendScript";

export default container => {
  console.log("applendLaunchLibrary1");
  // Write the container.js file here because getContainer requires the file
  const containerPath = path.join(
    __dirname,
    "../../../../.sandbox/container.js"
  );
  console.log("applendLaunchLibrary2");
  const text = `module.exports = ${JSON.stringify(container, null, 2)};`;
  console.log("applendLaunchLibrary3");
  fs.writeFileSync(containerPath, text);
  console.log("applendLaunchLibrary4");
  const containerJS = getContainer();

  console.log("applendLaunchLibrary5");
  const turbine = fs.readFileSync(
    require.resolve(`@adobe/reactor-turbine/dist/engine.js`)
  );
  console.log("appending script");
  return appendScript(containerJS + turbine);
};
