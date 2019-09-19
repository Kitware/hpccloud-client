import { mapGetters } from 'vuex';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

export default anonymousRedirect(
  {
    name: 'simulations.new',
    methods: {
      goBackHome() {
        this.$router.push(`/project/view/${this.project._id}`);
      },
      async createSimulation() {
        console.log('attachments', this.attachments);
        console.log('workflow', this.workflow);
        if (this.$refs.form.validate()) {
          const steps = this.workflow.steps._initial_state;
          const disabled = this.workflow.steps._disabled || [];
          const active =
            this.workflow.steps._active || this.workflow.steps._order[0];

          const simulation = await this.$store.dispatch('SIMULATION_CREATE', {
            name: this.name,
            description: this.description,
            steps,
            metadata: this.metadata,
            projectId: this.project._id,
            active,
            disabled,
            attachments: this.attachments,
          });
          this.$router.push(`/simulation/view/${simulation._id}`);
        }
      },
      addAttachement({ name, file }) {
        console.log('attachment name', name);
        this.attachments[name] = file;
      },
    },
    data() {
      return {
        valid: false,
        name: '',
        description: '',
        metadata: {},
        attachments: {},
        rules: {
          name: [
            (v) => !!v || 'Name is required',
            (v) =>
              (v && v.length >= 6) || 'Name must be more than 6 characters',
          ],
        },
      };
    },
    computed: {
      ...mapGetters({
        project: 'ACTIVE_PROJECT',
        workflow: 'ACTIVE_WORKFLOW',
      }),
      fileKeys() {
        return (
          (this.workflow &&
            this.workflow.attachments &&
            this.workflow.attachments.simulation) ||
          []
        );
      },
    },
  },
  '/'
);
