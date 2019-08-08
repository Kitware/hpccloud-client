import Vue from 'vue';

// Initialization
import 'hpccloud-client/src/plugins/vuetify';
import 'hpccloud-client/src/plugins/hpccloud';
import GirderProvider from 'hpccloud-client/src/plugins/girder';

// Vue components
import router from 'hpccloud-client/src/router';
import storeFactory from 'hpccloud-client/src/store';

// Entry point
import App from 'hpccloud-client/src/components/core/App';

// Allow dynamic workflow handling
import 'hpccloud-client/src/WorkflowManager';

// Simput
import registerDefaultProperties from 'simput/src/components/properties/registerDefaults';

Vue.config.productionTip = false;

// Simput initialization
const store = storeFactory();
registerDefaultProperties((name, component) => {
  store.commit('SIMPUT_ADD_PROPERTY_MAPPING', { name, component });
});

new Vue({
  provide: GirderProvider,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
