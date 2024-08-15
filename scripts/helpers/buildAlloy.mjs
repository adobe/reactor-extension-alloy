
import path from "path";
import fsPromises from "fs/promises";
import { rimraf } from "rimraf";
import run from "./run.mjs";

export default ({ tempDir, inputDir, outputDir }) => {

  const libInDir = path.join(inputDir, "lib");
  const libOutDir = path.join(outputDir, "lib");
  const alloyTempFile = path.join(tempDir, "alloy.js");
  const browserslistrcFile = path.join(libInDir, ".browserslistrc");
  const browserslistrcTempFile = path.join(tempDir, ".browserslistrc");

  // The package resolution in launch does not follow dependencies on npm packages, so we need to build our
  // own Alloy file here.
  // I tried having rollup run Babel, but it didn't respect the .browserslistrc located in the src/lib directory.
  return fsPromises
    .mkdir(tempDir)
    .catch(() => undefined)
    .then(() => fsPromises.copyFile(browserslistrcFile, browserslistrcTempFile))
    .then(() => run("rollup", ["-c"]))
    .then(() =>
      run("babel", [
        alloyTempFile,
        "--out-dir",
        libOutDir,
        "--presets=@babel/preset-env",
        "--compact=false",
      ]),
    )
    .finally(() => rimraf(tempDir));
};
