
import { fileURLToPath } from "url";
import path from "path";
import { Parcel } from "@parcel/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentFixturePath = path.join(
  __dirname,
  "../../test/functional/helpers/components/fixture.html",
);
const componentFixtureOutputDir = path.join(
  __dirname,
  "../../componentFixtureDist",
);

export default () => {
  return new Parcel({
    entries: componentFixturePath,
    defaultConfig: "@parcel/config-default",
    // Development mode is required to keep the data-test-id props
    mode: "development",
    defaultTargetOptions: {
      publicUrl: "./",
      distDir: componentFixtureOutputDir,
    },
    sourceMaps: true,
  }).run().then(() => {
    console.log("Built component fixtures");
  });
};
