import Vue from 'vue';

import { setSimputTypeLoader } from 'hpccloud-client/src/WorkflowManager';

import ModelManager from 'simput/src/core/ModelManager';

const LOADED_SCRIPTS = [];

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (LOADED_SCRIPTS.indexOf(url) === -1) {
      LOADED_SCRIPTS.push(url);
      const newScriptTag = document.createElement('script');
      newScriptTag.type = 'text/javascript';
      newScriptTag.src = url;
      newScriptTag.onload = resolve;
      newScriptTag.onerror = reject;
      document.body.appendChild(newScriptTag);
    } else {
      resolve();
    }
  });
}

export default {
  state: {
    mapping: {},
    types: {},
    loaded: {},
    model: null,
    dataManager: null,
  },
  getters: {
    SIMPUT_COMPONENT_GET(state) {
      return (name) => state.mapping[name.toLowerCase()];
    },
    SIMPUT_MODEL(state) {
      return state.model;
    },
    SIMPUT_DATAMANAGER(state) {
      return state.dataManager;
    },
  },
  mutations: {
    SIMPUT_ADD_PROPERTY_MAPPING(state, { name, component }) {
      Vue.set(state.mapping, name.toLowerCase(), component);
    },
    SIMPUT_TYPE_STATUS_SET(state, { type, status }) {
      state.loaded[type] = status;
    },
    SIMPUT_REGISTER_TEMPLATE(state, { type, urls }) {
      state.types[type] = { urls };
    },
  },
  actions: {
    SIMPUT_INITIALIZE({ commit }) {
      setSimputTypeLoader((type, urls) => {
        commit('SIMPUT_REGISTER_TEMPLATE', { type, urls });
      });
    },
    SIMPUT_CONFIGURE({ commit, state }, { type, model }) {
      state.model = model;
      const finishLoad = () => {
        const module = window.Simput.types[type];

        // Initialize hooks
        if (module.hooks) {
          module.hooks();
        }

        const dataManager = new ModelManager(module, state.model);
        state.dataManager = dataManager;
      };

      if (!state.loaded[type] && state.types[type] && state.types[type].urls) {
        commit('SIMPUT_TYPE_STATUS_SET', { type, status: 'pending' });
        Promise.all(state.types[type].urls.map(loadScript)).then(() => {
          commit('SIMPUT_TYPE_STATUS_SET', { type, status: 'loaded' });
          finishLoad();
        });
      } else if (state.loaded[type] === 'loaded') {
        finishLoad();
      }
    },
  },
};
