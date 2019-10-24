import { Selector } from "testcafe";
import spectrum from "./spectrum";
import testInstanceNameOptions from "./testInstanceNameOptions";

const instanceNameField = spectrum.select(Selector("[name=instanceName]"));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      configId: "PR123"
    },
    {
      name: "alloy2",
      configId: "PR456"
    }
  ]
};

export default extensionViewController => {
  test("initializes form fields with full settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings,
      settings: {
        instanceName: "alloy2"
      }
    });
    await instanceNameField.expectValue(t, "alloy2");
  });

  test("initializes form fields with no settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.expectValue(t, "alloy1");
  });

  test("returns full valid settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.selectOption(t, "alloy2");
    await extensionViewController.expectIsValid(t);
    await extensionViewController.expectSettings(t, {
      instanceName: "alloy2"
    });
  });

  testInstanceNameOptions(extensionViewController, instanceNameField);
};
