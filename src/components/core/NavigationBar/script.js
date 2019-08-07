import { mapGetters } from 'vuex';

export default {
  name: 'NavigationBar',
  computed: {
    ...mapGetters({
      projectId: 'ACTIVE_PROJECT_ID',
      simulationId: 'ACTIVE_SIMULATION_ID',
      projectById: 'DB_PROJECT_BY_ID',
      simulationById: 'DB_SIMULATION_BY_ID',
    }),
    project() {
      return this.projectById(this.projectId) || {};
    },
    simulation() {
      return this.simulationById(this.simulationId) || {};
    },
    title() {
      return this.simulation.name || this.project.name || null;
    },
  },
};
