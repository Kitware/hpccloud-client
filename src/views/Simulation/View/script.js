import { mapGetters } from 'vuex';

import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';
import NoContent from 'hpccloud-client/src/components/common/NoContent';

export default anonymousRedirect(
  {
    name: 'simulation.view',
    computed: {
      ...mapGetters({
        simulationId: 'ACTIVE_SIMULATION_ID',
        simulation: 'ACTIVE_SIMULATION',
        project: 'ACTIVE_PROJECT',
        workflow: 'ACTIVE_WORKFLOW',
      }),
      step() {
        return this.simulation.active;
      },
      view() {
        return (
          this.simulation.steps[this.step].view ||
          this.$route.params.view ||
          'default'
        );
      },
      component() {
        if (!this.step || !this.workflow || !this.workflow.steps[this.step]) {
          return NoContent;
        }

        return (
          this.workflow.steps[this.step][this.view] ||
          this.workflow.steps[this.step].default
        );
      },
      metadata() {
        const step = this.simulation.active;
        if (!step) {
          return null;
        }
        return this.simulation.steps[step].metadata;
      },
    },
  },
  '/'
);
