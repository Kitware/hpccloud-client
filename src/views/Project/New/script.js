import { mapGetters } from 'vuex';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

export default anonymousRedirect(
  {
    name: 'projects.new',
    methods: {
      goBackHome() {
        this.$router.push('/');
      },
      async createProject() {
        console.log('attachments', this.attachments);
        console.log('steps', this.steps);
        if (this.$refs.form.validate()) {
          const project = await this.$store.dispatch('PROJECT_CREATE', {
            name: this.name,
            description: this.description,
            type: this.type,
            steps: this.steps,
            metadata: this.metadata,
            attachments: this.attachments,
          });
          this.$router.push(`/project/view/${project._id}`);
        }
      },
    },
    watch: {
      type(value) {
        this.$store.dispatch('WF_LOAD', value).then(() => {
          this.workflow = this.workflowByName(value);
          this.expectedAttachement =
            (this.workflow &&
              this.workflow.requiredAttachments &&
              this.workflow.requiredAttachments.project) ||
            [];
        });
      },
    },
    data() {
      return {
        valid: false,
        name: '',
        description: '',
        type: '',
        metadata: {},
        attachments: null,
        expectedAttachement: [],
        rules: {
          name: [
            (v) => !!v || 'Name is required',
            (v) =>
              (v && v.length >= 6) || 'Name must be more than 6 characters',
          ],
          type: [(v) => !!v || 'A project type is required'],
        },
      };
    },
    computed: {
      ...mapGetters({
        workflowByName: 'WF_GET',
        types: 'WF_LISTING',
      }),
      steps() {
        const orders = (this.workflow && this.workflow.steps._order) || [];
        return Array.isArray(orders) ? orders : orders.default;
      },
    },
  },
  '/'
);
