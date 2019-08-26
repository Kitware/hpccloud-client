import Vue from 'vue';
import Vuex from 'vuex';

import active from 'hpccloud-client/src/store/active';
import events from 'hpccloud-client/src/store/events';
import http from 'hpccloud-client/src/store/http';
import simput from 'hpccloud-client/src/store/simput';
import simulation from 'hpccloud-client/src/store/simulation';
import taskflow from 'hpccloud-client/src/store/taskflow';
import workflow from 'hpccloud-client/src/store/workflow';

// runtimes
import runtimeTrad from 'hpccloud-client/src/runtimes/trad/store.js';

// Install VueX
Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    state: {
      ready: false,
    },
    modules: {
      active,
      events,
      http,
      runtimeTrad,
      simput,
      simulation,
      taskflow,
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
        dispatch('PROJECTS_CLEAR');
      },
      async GIRDER_INITIALIZE({ commit, dispatch, state }, girderClient) {
        commit('HTTP_CLIENT_SET', girderClient);

        girderClient.$on('login', (user) => {
          dispatch('UPDATE_USER', user);
          dispatch('HTTP_CONNECT_EVENTS');
        });
        girderClient.$on('logout', () => {
          dispatch('UPDATE_USER', null);
          dispatch('HTTP_DISCONNECT_EVENTS');
        });

        const user = await girderClient.fetchUser();
        await dispatch('UPDATE_USER', user);
        dispatch('HTTP_CONNECT_EVENTS');

        state.ready = true;
      },
      async UPDATE_USER({ commit, dispatch }, user) {
        dispatch('PROJECTS_CLEAR');
        commit('ACTIVE_USER_SET', user);

        // Load user projects
        if (user) {
          dispatch('SIMPUT_INITIALIZE');
          const { data } = await dispatch('HTTP_PROJECTS_LIST');
          commit('PROJECTS_SET', data);
          for (let i = 0; i < data.length; i++) {
            dispatch('WF_LOAD', data[i].type);
          }
        }
      },
    },
  });
}

export default createStore;
