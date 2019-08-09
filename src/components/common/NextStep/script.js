import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'hpcNextStep',
  computed: {
    ...mapGetters({
      project: 'ACTIVE_PROJECT',
      simulation: 'ACTIVE_SIMULATION',
      workflow: 'ACTIVE_WORKFLOW',
      steps: 'ACTIVE_SIMULATION_STEPS',
      stepIdx: 'ACTIVE_SIMULATION_STEP_IDX',
    }),
    disabled() {
      return !(this.stepIdx + 1 < this.steps.length);
    },
  },
  methods: {
    ...mapActions({
      updateActiveStep: 'SIMULATION_UPDATE_ACTIVE_STEP',
    }),
    next() {
      const { _id: id } = this.simulation;
      const active = this.steps[this.stepIdx + 1];
      this.updateActiveStep({ id, active });
    },
  },
};
