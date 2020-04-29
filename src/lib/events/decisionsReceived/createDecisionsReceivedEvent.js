module.exports = ({ decisionsCallbackStorage }) => (settings, trigger) => {
  decisionsCallbackStorage.add(trigger);
};
