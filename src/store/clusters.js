export default {
  state: {
    clusters: [],
  },
  getters: {
    CLUSTERS_GET_BY_ID(state) {
      state.clusters;
      return (id_) => state.clusters.find(({ id }) => id === id_);
    },
  },
  mutations: {
    CLUSTERS_SET(state, value) {
      console.log('set clusters', value);
      state.clusters = value;
    },
  },
  actions: {
    async CLUSTERS_FETCH({ commit, dispatch }) {
      const { data } = await dispatch('HTTP_CLUSTERS_LIST', 'trad');
      commit('CLUSTERS_SET', data);
      return data;
    },
  },
};
