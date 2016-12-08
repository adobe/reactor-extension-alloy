/* eslint dot-notation: 0 */

import { getFormValues, initialize, change, submit, isValid } from 'redux-form';
import { actionCreators } from './reduxActions/bridgeAdapterActions';
import eventBus from './utils/eventBus';

export default (extensionBridge, store, formConfig) => {
  extensionBridge.register({
    init(options = {}) {
      let {
        settings,
        ...meta
      } = options;

      meta.isNew = !settings;
      settings = settings || {};

      // Populate the state with all the metadata coming in. This includes things like
      // extension configurations, tokens, org ID, etc. We need to populate state with this
      // information before passing it to settingsToFormValues below.
      store.dispatch(actionCreators.populateMeta(meta));

      // Tell redux-form to initialize our form to the initialValues provided above.
      const initialValues = formConfig.settingsToFormValues({}, settings, store.getState().meta);
      store.dispatch(initialize('default', initialValues));

      // The view won't render until the state says that init is complete so in order to avoid
      // useless renders we want to do this as late as possible (after initializing
      // redux-form values above).
      store.dispatch(actionCreators.markInitComplete());
    },
    getSettings() {
      const state = store.getState();
      // This sometimes returns undefined: https://github.com/erikras/redux-form/issues/2017
      const values = getFormValues('default')(state) || {};

      delete values['__bogusname__'];

      return formConfig.formValuesToSettings({}, values, state.meta);
    },
    validate() {
      // Workaround for https://github.com/erikras/redux-form/issues/1477
      // Without this workaround, if the user hasn't changed the form and by default the form
      // is invalid, it will incorrectly report that it is valid.
      store.dispatch(change('default', '__bogusname__', '__bogusvalue__'));

      store.dispatch(submit('default'));

      const valid = isValid('default')(store.getState());

      eventBus.emit('validationOccurred');

      return valid;
    }
  });
};
