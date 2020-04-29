const decisionsReceivedEventTriggers = [];

module.exports = {
  add(trigger) {
    decisionsReceivedEventTriggers.push(trigger);
  },
  triggerEvent(decisions) {
    decisionsReceivedEventTriggers.forEach(trigger => {
      trigger(decisions);
    });
  }
};
