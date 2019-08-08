module.exports = {
  mock(turbine) {
    window.turbine = turbine;
  },
  reset() {
    delete window.turbine;
  }
};
