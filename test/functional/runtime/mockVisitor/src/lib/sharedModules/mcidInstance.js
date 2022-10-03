const ecid = "123456789abcdef0";
const initialize = () => {
  const instance = {
    getMarketingCloudVisitorID(callback) {
      callback(ecid);
    }
  };
  window.Visitor = () => undefined;
  window.Visitor.getInstance = () => {
    return instance;
  };
};

module.exports = new Promise(resolve => {
  // console.log("Initializing visitor");
  setTimeout(() => {
    initialize();
    resolve();
    // console.log("Done initializing visitor");
  }, 1000);
});
