import { useRef } from "react";

export default (initInfo) => {
  // TODO: useRef instead of useState
  //const [registeredGetSettings, setRegisteredGetSettings] = useState([]);
  const ref = useRef([]);

  return {
    extensionViewContext: {
      registerGetSettings(getSettings) {
        //console.log("registering getSettings");
        ref.current.push(getSettings);
        //setRegisteredGetSettings(array => [...array, getSettings]);
      },
      initInfo
    },
    getCombinedSettings() {
      //console.log("Getting combined settings", registeredGetSettings.length);
      const settingsArray = ref.current.map(getSettings => getSettings());
      return Object.assign({}, ...settingsArray);
    }
  }
};
