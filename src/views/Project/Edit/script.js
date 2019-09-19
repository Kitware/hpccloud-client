import { mapGetters } from 'vuex';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

export default anonymousRedirect(
  {
    name: 'project.edit',
    methods: {
      deleteProject() {
        if (!confirm('Are you sure you want to delete this project?')) {
          return;
        }
        this.$store.dispatch('PROJECT_DELETE', this.project);
        this.goBackHome();
      },
      goBackHome() {
        this.$router.push('/');
      },
      async saveProject() {
        if (this.$refs.form.validate()) {
          const { name, description } = this;
          await this.$store.dispatch(
            'PROJECT_UPDATE',
            Object.assign({}, this.project, { name, description })
          );
          this.goBackHome();
        }
      },
      pushValues() {
        this.name = (this.project && this.project.name) || '';
        this.description = (this.project && this.project.description) || '';
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
      }),
    },
  },
  '/'
);
