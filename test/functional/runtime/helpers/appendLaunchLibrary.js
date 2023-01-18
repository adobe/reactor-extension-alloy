import path from "path";
import fs from "fs";
import getContainer from "@adobe/reactor-sandbox/src/tasks/helpers/getContainer";
import appendScript from "./appendScript";

export default container => {
  // Write the container.js file here because getContainer requires the file
  const containerPath = path.join(
    __dirname,
    "../../../../.sandbox/container.js"
  );
  const text = `module.exports = ${JSON.stringify(container, null, 2)};`;
  fs.writeFileSync(containerPath, text);
  const containerJS = getContainer();

  const turbine = fs.readFileSync(
    require.resolve(`@adobe/reactor-turbine/dist/engine.js`)
  );
  return appendScript(containerJS + turbine);
};
