import setSettingsField from "../../../../src/view/utils/setSettingsField";

describe("setSettingsField", () => {
  it("sets an object property", () => {
    const settings = { a: 1 };
    setSettingsField(settings, "b", 2);
    expect(settings).toEqual({ a: 1, b: 2 });
  });
  it("sets an array property", () => {
    const settings = [1];
    setSettingsField(settings, "1", 2);
    expect(settings).toEqual([1, 2]);
  });
});
