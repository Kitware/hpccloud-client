import Vue from 'vue';
import Vuex from 'vuex';

import active from 'hpccloud-client/src/store/active';
import db from 'hpccloud-client/src/store/db';
import http from 'hpccloud-client/src/store/http';
import simput from 'hpccloud-client/src/store/simput';
import simulation from 'hpccloud-client/src/store/simulation';
import workflow from 'hpccloud-client/src/store/workflow';

// runtimes
import runtimeTrad from 'hpccloud-client/src/components/runtimes/traditional/store.js';

// Install VueX
Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    state: {
      ready: false,
    },
    modules: {
      active,
      db,
      http,
      runtimeTrad,
      simput,
      simulation,
      workflow,
    },
    getters: {
      IS_READY(state) {
        return state.ready;
      },
    },
    actions: {
      LOGOUT({ dispatch }) {
        dispatch('HTTP_LOGOUT');
        dispatch('DB_UPDATE_PROJECTS', []);
      },
      async GIRDER_INITIALIZE({ commit, dispatch, state }, girderClient) {
        commit('HTTP_CLIENT_SET', girderClient);

        girderClient.$on('login', (user) => {
          dispatch('UPDATE_USER', user);
        });
        girderClient.$on('logout', () => {
          dispatch('UPDATE_USER', null);
        });

        const user = await girderClient.fetchUser();
        await dispatch('UPDATE_USER', user);

        state.ready = true;
      },
      async UPDATE_USER({ commit, dispatch }, user) {
        dispatch('DB_RESET');
        commit('ACTIVE_USER_SET', user);

        // Load user projects
        if (user) {
          dispatch('SIMPUT_INITIALIZE');
          const { data } = await dispatch('HTTP_PROJECTS_FETCH');
          dispatch('DB_UPDATE_PROJECTS', data);
          for (let i = 0; i < data.length; i++) {
            dispatch('WF_LOAD', data[i].type);
          }
        }
      },
    },
  });
}

export default createStore;
