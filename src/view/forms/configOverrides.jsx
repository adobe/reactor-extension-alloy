import { reach } from "yup";
import Overrides, { bridge as overridesBridge } from "../components/overrides";

export default function configOverrides() {
  return {
    getInitialValues({ initInfo }) {
      return overridesBridge.getInitialInstanceValues({
        instanceSettings: initInfo.settings || {}
      });
    },
    getSettings({ values }) {
      return overridesBridge.getInstanceSettings({ instanceValues: values });
    },
    validationShape: {
      edgeConfigOverrides: reach(
        overridesBridge.formikStateValidationSchema,
        "edgeConfigOverrides"
      )
    },
    Component: Overrides
  };
}
