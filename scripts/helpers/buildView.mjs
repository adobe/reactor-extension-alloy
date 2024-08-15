import path from "path";
import { Parcel } from "@parcel/core";

export default ({ watch = false, inputDir, outputDir }) => {

  const viewEntries = path.join(inputDir, "view/**/*.html");
  const viewOutDir = path.join(outputDir, "view");

  const isProd = process.env.NODE_ENV === "production";

  const bundler = new Parcel({
    entries: viewEntries,
    defaultConfig: "@parcel/config-default",
    mode: isProd ? "production" : "development",
    // By default, Parcel updates script tags on HTML files to reference post-processed JavaScript files
    // by using an absolute directory. We can't use absolute directories, because our extension's view files
    // are deployed by Launch to Akamai under a deep subdirectory. We use publicUrl to ensure we use a relative
    // path for loading JavaScript files.
    defaultTargetOptions: {
      publicUrl: "../",
      distDir: viewOutDir,
      sourceMaps: !isProd,
      // shouldOptimize: false,
      shouldScopeHoist: false,
    },
    shouldDisableCache: true,
    additionalReporters: [
      {
        packageName: "@parcel/reporter-cli",
        resolveFrom: viewOutDir,
      },
    ],
  });
  let parcelPromise;
  if (watch) {
    parcelPromise = new Promise((resolve) => {
      const subscription = bundler.watch(() => {
        resolve();
      });
      process.on("exit", () => {
        // stop watching when the main process exits
        if (typeof subscription?.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      });
    });
  } else {
    parcelPromise = bundler.run();
  }
  return parcelPromise;
}
