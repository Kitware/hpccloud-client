import { mapGetters } from 'vuex';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';
import { getTaskflowStatus } from 'hpccloud-client/src/utils/TaskflowHelper';

export default anonymousRedirect(
  {
    name: 'simulation.edit',
    methods: {
      deleteSimulation() {
        if (!confirm('Are you sure you want to delete this simulation?')) {
          return;
        }
        this.$store.dispatch('SIMULATION_DELETE', this.simulation);
        this.goBackToProject();
      },
      goBackToProject() {
        this.$router.push(`/project/view/${this.project._id}`);
      },
      async saveSimulation() {
        if (this.$refs.form.validate()) {
          const { name, description } = this;
          await this.$store.dispatch(
            'SIMULATION_UPDATE',
            Object.assign({}, this.simulation, { name, description })
          );
          this.goBackToProject();
        }
      },
      pushValues() {
        this.name = (this.simulation && this.simulation.name) || '';
        this.description =
          (this.simulation && this.simulation.description) || '';
      },
    },
    data() {
      return {
        valid: false,
        name: '',
        description: '',
        rules: {
          name: [
            (v) => !!v || 'Name is required',
            (v) =>
              (v && v.length >= 6) || 'Name must be more than 6 characters',
          ],
        },
      };
    },
    mounted() {
      this.$nextTick(this.pushValues);
    },
    computed: {
      ...mapGetters({
        project: 'ACTIVE_PROJECT',
        simulation: 'ACTIVE_SIMULATION',
        getTaskflowById: 'TASKFLOW_GET_BY_ID',
      }),
      canDelete() {
        return this.status !== 'running';
      },
      status() {
        const activeStep = this.simulation.steps[this.simulation.active];
        const taskflow = this.getTaskflowById(activeStep.metadata.taskflowId);
        return getTaskflowStatus(taskflow) || this.simulation.metadata.status;
      },
    },
  },
  '/'
);
