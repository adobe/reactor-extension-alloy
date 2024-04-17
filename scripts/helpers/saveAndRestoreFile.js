const fs = require("fs");

module.exports = ({ file, extension = ".tmp" }) => {
  const backupFile = `${file}${extension}`;

  if (fs.existsSync(file)) {
    fs.renameSync(file, backupFile);

    const cleanup = () => {
      if (fs.existsSync(backupFile)) {
        fs.renameSync(backupFile, file);
      }
    };

    ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"].forEach(
      event => {
        process.on(event, cleanup);
      }
    );
  }
};
