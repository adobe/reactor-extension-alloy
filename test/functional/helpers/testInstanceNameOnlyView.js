import { Selector } from "testcafe";
import spectrum from "./spectrum";
import testInstanceNameOptions from "./testInstanceNameOptions";

const instanceNameField = spectrum.select(Selector("[name=instanceName]"));

const mockExtensionSettings = {
  instances: [
    {
      name: "alloy1",
      propertyId: "PR123"
    }
  ]
};

export default extensionViewController => {
  test("initializes form fields with full settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings,
      settings: {
        instanceName: "alloy1"
      }
    });
    await instanceNameField.expectValue(t, "alloy1");
  });

  test("initializes form fields with no settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.expectValue(t, "");
  });

  test("returns full valid settings", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings
    });
    await instanceNameField.selectOption(t, "alloy1");
    await extensionViewController.expectIsValid(t);
    await extensionViewController.expectSettings(t, {
      instanceName: "alloy1"
    });
  });

  test("shows errors for empty required values", async t => {
    await extensionViewController.init(t, {
      extensionSettings: mockExtensionSettings
    });
    await extensionViewController.expectIsNotValid(t);
    await instanceNameField.expectError(t);
  });

  testInstanceNameOptions(extensionViewController, instanceNameField);
};
