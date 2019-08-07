export default {
  state: {
    girderClient: null,
  },
  getters: {
    HTTP_CLIENT(state) {
      return state.girderClient;
    },
  },
  mutations: {
    HTTP_CLIENT_SET(state, value) {
      state.girderClient = value;
    },
  },
  actions: {
    HTTP_LOGOUT({ state }) {
      state.girderClient.logout();
    },
    async HTTP_PROJECTS_FETCH({ state }) {
      return await state.girderClient.get('projects');
    },
    async HTTP_PROJECT_SIMULATIONS_FETCH({ state }, id) {
      return await state.girderClient.get(`projects/${id}/simulations`);
    },
    async HTTP_PROJECT_FETCH_BY_ID({ state }, id) {
      return await state.girderClient.get(`projects/${id}`);
    },
    async HTTP_SIMULATION_FETCH_BY_ID({ state }, id) {
      return await state.girderClient.get(`simulations/${id}`);
    },
  },
};
