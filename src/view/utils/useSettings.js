import { useState } from "react";

export default () => {

  const [settings, setSettings] = useState({});

  const applyClaimedField = (to, settingsSubset, claimedField) => {
    const firstPeriod = claimedField.indexOf(".");
    if (firstPeriod === -1) {
      return Object.assign({}, to, { [claimedField]: settingsSubset[claimedField] });
    }
    const firstPart = claimedField.substring(0,firstPeriod);
    const secondPart = claimedField.substring(firstPeriod+1);
    const recursedValue = applyClaimedField(to[firstPart], settingsSubset[firstPart], secondPart);
    return Object.assign({}, to, { [firstPart]: recursedValue });
  };

  const applySubset = (to, settingsSubset, claimedFields) => {
    return claimedFields.reduce((to, claimedField) => {
      return applyClaimedField(to, settingsSubset, claimedField);
    }, to);
  }

  const saveSubset = (settingsSubset, claimedFields) => {
    setSettings(applySubset(settings, settingsSubset, claimedFields));
  };


  return [settings, setSettings, saveSubset, applySubset];
}
