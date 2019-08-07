import Vue from 'vue';

export default {
  state: {
    user: null,
    lastIds: {},
    viewType: null,
  },
  getters: {
    ACTIVE_USER(state) {
      return state.user;
    },
    ACTIVE_PROJECT_ID(state) {
      return state.lastIds.project;
    },
    ACTIVE_SIMULATION_ID(state) {
      return state.lastIds.simulation;
    },
  },
  mutations: {
    ACTIVE_USER_SET(state, value) {
      state.user = value;
    },
  },
  actions: {
    async ACTIVE_PROCESS_ROUTE({ state, dispatch }, route) {
      const { path, params } = route;
      const [, objectType, viewType, id] = path.split('/');
      state.viewType = viewType;

      if (id) {
        Vue.set(state.lastIds, objectType, params.id);
      }

      if (objectType === 'projects') {
        // reset all
        state.lastIds = {};
      }

      if (objectType === 'project' && id) {
        // reset sub-project keys
        state.lastIds = { project: id };
      }

      if (id) {
        switch (objectType) {
          case 'project':
            {
              const { data } = await dispatch(
                'HTTP_PROJECT_SIMULATIONS_FETCH',
                id
              );
              dispatch('DB_UPDATE_SIMULATIONS', data);
            }
            break;
          case 'simulation':
            {
              const { data } = await dispatch(
                'HTTP_SIMULATION_FETCH_BY_ID',
                id
              );
              dispatch('DB_UPDATE_SIMULATION', data);
              Vue.set(state.lastIds, 'project', data.projectId);
            }
            break;
        }
      }
    },
  },
};
