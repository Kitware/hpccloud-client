import { mapGetters, mapActions } from 'vuex';

import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';
import NoContent from 'hpccloud-client/src/components/common/NoContent';

export default anonymousRedirect(
  {
    name: 'simulation.view',
    watch: {
      ...mapActions({
        simulation: 'SIMULATION_TASKFLOWS_FETCH',
      }),
    },
    computed: {
      ...mapGetters({
        simulation: 'ACTIVE_SIMULATION',
        project: 'ACTIVE_PROJECT',
        workflow: 'ACTIVE_WORKFLOW',
      }),
      component() {
        const step = this.simulation.active;
        if (!step || !this.workflow || !this.workflow.steps[step]) {
          return NoContent;
        }

        const view =
          this.simulation.steps[step].view ||
          this.$route.params.view ||
          'default';

        return (
          this.workflow.steps[step][view] || this.workflow.steps[step].default
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
