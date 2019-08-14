export default {
  state: {
    clusters: [],
  },
  getters: {
    TRADITIONAL_CLUSTERS(state) {
      return state.clusters;
    },
  },
  mutations: {
    TRADITIONAL_CLUSTERS_SET(state, value) {
      state.clusters = value;
    },
  },
  actions: {
    async TRADITIONAL_FETCH_CLUSTERS({ getters, commit }) {
      const { data } = await getters.HTTP_CLIENT.get('clusters?type=trad');
      commit('TRADITIONAL_CLUSTERS_SET', data);
    },
  },
};
