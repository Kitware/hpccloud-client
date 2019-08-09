import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavigationBar',
  computed: {
    ...mapGetters({
      projectId: 'ACTIVE_PROJECT_ID',
      simulationId: 'ACTIVE_SIMULATION_ID',
      project: 'ACTIVE_PROJECT',
      simulation: 'ACTIVE_SIMULATION',
      workflow: 'ACTIVE_WORKFLOW',
      steps: 'ACTIVE_SIMULATION_STEPS',
      stepIdx: 'ACTIVE_SIMULATION_STEP_IDX',
    }),
    title() {
      return this.simulation.name || this.project.name || null;
    },
    activeIndex: {
      get() {
        return this.stepIdx + 1;
      },
      set(v) {
        const { _id: id } = this.simulation;
        const active = this.steps[v - 1];
        this.updateActiveStep({ id, active });
      },
    },
  },
  methods: {
    ...mapActions({
      updateActiveStep: 'SIMULATION_UPDATE_ACTIVE_STEP',
    }),
  },
};
