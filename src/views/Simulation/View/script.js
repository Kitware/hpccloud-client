import { mapGetters } from 'vuex';

import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

export default anonymousRedirect(
  {
    name: 'simulation.view',
    computed: {
      ...mapGetters({
        mtimeProject: 'DB_MTIME_PROJECT',
        mtimeSimulation: 'DB_MTIME_PROJECT',
        simulationById: 'DB_SIMULATION_BY_ID',
        projectById: 'DB_PROJECT_BY_ID',
        getWorkflow: 'WF_GET',
      }),
      simulation() {
        console.log('simulation change');
        this.mtimeSimulation;
        return this.simulationById(this.$route.params.id);
      },
      project() {
        this.mtimeProject;
        return this.projectById(this.simulation.projectId);
      },
      activeStepIdx() {
        return this.project.steps.indexOf(this.simulation.active) || 0;
      },
      workflow() {
        return this.getWorkflow(this.project.type);
      },
      getComponent() {
        return (step) =>
          this.workflow.steps[step] &&
          (this.workflow.steps[step][this.$route.params.view] ||
            this.workflow.steps[step].default);
      },
    },
    methods: {
      nextStep() {
        console.log('next step');
      },
    },
  },
  '/'
);
