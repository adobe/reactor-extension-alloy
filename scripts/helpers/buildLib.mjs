import path from "path";
import run from "./run.mjs";
import sandbox from "@adobe/reactor-sandbox";

export default async ({ watch = false, inputDir, outputDir }) => {

  // Runtime tests need a .sandbox file to run
  await sandbox.init();

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
