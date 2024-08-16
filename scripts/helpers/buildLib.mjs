import path from "path";
import run from "./run.mjs";
import fs from "fs";

export default async ({ watch = false, inputDir, outputDir }) => {

  // Runtime tests need a .sandbox directory to run
  const sandboxDir = path.join(outputDir, "../.sandbox");
  if (!fs.existsSync(sandboxDir)) {
    fs.mkdirSync(sandboxDir);
  }

  const libInDir = path.join(inputDir, "lib");
  const libOutDir = path.join(outputDir, "lib");
  const alloyInFile = path.join(libInDir, "alloy.js");

  // ignore alloy.js because it will be built separately in buildAlloy.js
  const promise = run("babel", [
    libInDir,
    "--out-dir",
    libOutDir,
    "--ignore",
    alloyInFile,
    "--presets=@babel/preset-env",
  ]);

  if (watch) {
    const babelWatchSubprocess = spawn(
      "babel",
      [
        libInDir,
        "--out-dir",
        libOutDir,
        "--watch",
        "--skip-initial-build",
        "--ignore",
        alloyInFile,
        "--presets=@babel/preset-env",
      ],
      { stdio: "inherit" },
    );
    // cleanup this process on ctrl-c
    process.on("exit", () => {
      babelWatchSubprocess.kill();
    });
  }

  return promise;
}
