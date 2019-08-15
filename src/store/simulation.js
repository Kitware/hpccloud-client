export default {
  actions: {
    async SIMULATION_FETCH({ dispatch }, id) {
      const { data } = await dispatch('HTTP_SIMULATIONS_GET_BY_ID', id);
      dispatch('DB_UPDATE_SIMULATION', data);
      return data;
    },
    async SIMULATION_UPDATE_STEP({ dispatch }, { id, step, content }) {
      const { data } = await dispatch('HTTP_SIMULATIONS_UPDATE_STEP', {
        id,
        step,
        content,
      });
      dispatch('DB_UPDATE_SIMULATION', data);
      return data;
    },
    async SIMULATION_UPDATE_ACTIVE_STEP({ dispatch }, { id, active }) {
      const { data } = await dispatch('HTTP_SIMULATIONS_UPDATE', {
        id,
        content: { active },
      });
      dispatch('DB_UPDATE_SIMULATION', data);
      return data;
    },
  },
};
