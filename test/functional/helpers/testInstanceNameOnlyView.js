import spectrum from "./spectrum";
import testInstanceNameOptions from "./testInstanceNameOptions";

const instanceNameField = spectrum.select("instanceNameField");

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
  test("initializes form fields with full settings", async () => {
    await extensionViewController.init({
      extensionSettings: mockExtensionSettings,
      settings: {
        instanceName: "alloy2"
      }
    });
    await instanceNameField.expectValue("alloy2");
  });

  test("initializes form fields with no settings", async () => {
    await extensionViewController.init({
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.expectValue("alloy1");
  });

  test("returns full valid settings", async () => {
    await extensionViewController.init({
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.selectOption("alloy2");
    await extensionViewController.expectIsValid();
    await extensionViewController.expectSettings({
      instanceName: "alloy2"
    });
  });

  testInstanceNameOptions(extensionViewController, instanceNameField);
};
