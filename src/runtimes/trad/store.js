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
    async TRADITIONAL_FETCH_CLUSTERS({ dispatch, commit }) {
      const { data } = await dispatch('HTTP_CLUSTERS_LIST', 'trad');
      commit('TRADITIONAL_CLUSTERS_SET', data);
    },
  },
};
