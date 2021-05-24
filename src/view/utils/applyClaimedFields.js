const shallowCloneWithUpdatedField = (obj, fieldToUpdate, value) => {
  const newObj = Object.assign({}, obj, { [fieldToUpdate]: value });
  if (value === undefined) {
    delete newObj[fieldToUpdate];
  }
  return newObj;
};

const applyClaimedField = (to, settingsSubset, claimedField) => {
  const firstPeriod = claimedField.indexOf(".");
  if (firstPeriod === -1) {
    return shallowCloneWithUpdatedField(
      to,
      claimedField,
      settingsSubset[claimedField]
    );
  }
  const firstPart = claimedField.substring(0, firstPeriod);
  const secondPart = claimedField.substring(firstPeriod + 1);
  const recursedValue = applyClaimedField(
    to[firstPart],
    settingsSubset[firstPart],
    secondPart
  );
  return shallowCloneWithUpdatedField(to, firstPart, recursedValue);
};

// TODO: Add support for arrays?
export default (to, settingsSubset, claimedFields) => {
  return claimedFields.reduce((memo, claimedField) => {
    return applyClaimedField(memo, settingsSubset, claimedField);
  }, to);
};
