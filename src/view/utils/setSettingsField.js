export default setSettingsField = (obj, name, value) => {
  const firstPeriod = name.indexOf(".");
  if (firstPeriod === -1) {
    obj[name] = value;
  } else {
    const key = name.substring(0, firstPeriod);
    const rest = name.substring(firstPeriod + 1);
    setSettingsField(obj[key], rest, value);
  }
}
