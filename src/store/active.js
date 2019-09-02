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
    // Helpers ----------------------------------------------------------------
    ACTIVE_PROJECT(state, getters) {
      return getters.PROJECT_BY_ID(getters.ACTIVE_PROJECT_ID) || {};
    },
    ACTIVE_SIMULATION(state, getters) {
      return getters.SIMULATION_BY_ID(getters.ACTIVE_SIMULATION_ID) || {};
    },
    ACTIVE_WORKFLOW(state, getters) {
      const { type } = getters.ACTIVE_PROJECT;
      const { name } = getters.ACTIVE_SIMULATION;
      if (type && name) {
        return getters.WF_GET(type);
      }
      return null;
    },
    ACTIVE_SIMULATION_STEP(state, getters) {
      const simulation = getters.ACTIVE_SIMULATION;
      return (simulation && simulation.active) || 'Introduction';
    },
    ACTIVE_SIMULATION_STEP_IDX(state, getters) {
      const workflow = getters.ACTIVE_WORKFLOW;
      const { active } = getters.ACTIVE_SIMULATION;
      if (workflow && active) {
        return workflow.steps._order.indexOf(active);
      }

      return 0;
    },
    ACTIVE_SIMULATION_STEPS(state, getters) {
      const workflow = getters.ACTIVE_WORKFLOW;
      return (workflow && workflow.steps._order) || [];
    },
  },
  mutations: {
    ACTIVE_USER_SET(state, value) {
      state.user = value;
    },
  },
  actions: {
    async ACTIVE_PROCESS_ROUTE({ state, getters, commit, dispatch }, route) {
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
                'HTTP_PROJECTS_GET_SIMULATION_LIST',
                id
              );
              commit('PROJECT_SET_SIMULATIONS', data);
            }
            break;
          case 'tool': {
            dispatch('TOOLS_LOAD', viewType);
            // tools can only operate on simulation so we keep going...
          }
          /* eslint-disable no-fallthrough */
          case 'simulation':
            {
              if (getters.ACTIVE_SIMULATION._id !== id) {
                const sim = await dispatch('SIMULATION_FETCH', id);
                await dispatch('SIMULATION_TASKFLOWS_FETCH', sim);
                state.lastIds.simulation = id;
                Vue.set(state.lastIds, 'project', sim.projectId);
              }
            }
            break;
        }
      }
    },
  },
};
