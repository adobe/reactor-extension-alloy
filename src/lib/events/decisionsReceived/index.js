const decisionsCallbackStorage = require("../../decisionsCallbackStorage");
const createDecisionsReceivedEvent = require("./createDecisionsReceivedEvent");

module.exports = createDecisionsReceivedEvent({
  decisionsCallbackStorage
});
