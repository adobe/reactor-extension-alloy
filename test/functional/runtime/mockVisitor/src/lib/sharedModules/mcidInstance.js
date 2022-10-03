const ecid = "00781847927133700121980094732316198575";

window.Visitor = () => undefined;
window.Visitor.getInstance = () => {
  return {
    getMarketingCloudVisitorID(callback) {
      callback(ecid);
    }
  };
};

module.exports = window.Visitor;
