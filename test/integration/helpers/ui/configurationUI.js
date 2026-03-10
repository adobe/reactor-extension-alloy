import field from "../field";

export default function configurationUI(view) {
  const expand = async (name) => {
    await field(view.getByRole("button", { name })).expand();
  };
  return {
    expand,
    toggleComponent: async (component) => {
      await expand("Build options");
      await field(view.getByTestId(`${component}ComponentCheckbox`)).click();
    },
  };
}
