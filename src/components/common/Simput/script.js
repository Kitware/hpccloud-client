import WorkflowContent from 'simput/src/components/core/WorkflowContent';
import WorkflowMenu from 'simput/src/components/core/WorkflowMenu';

export default {
  name: 'hpcSimput',
  components: {
    WorkflowContent,
    WorkflowMenu,
  },
  props: {
    simulation: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    model: {
      type: Object,
      default: null,
    },
    step: {
      type: String,
      default: null,
    },
  },
  mounted() {
    this.updateSimputModel();
  },
  watch: {
    model() {
      this.updateSimputModel();
    },
  },
  methods: {
    updateSimputModel() {
      const { type, model } = this;
      this.$store.dispatch('SIMPUT_CONFIGURE', { type, model });
    },
    cancel() {
      this.$store.dispatch('SIMULATION_FETCH', this.simulation._id);
    },
    save() {
      this.$store.dispatch('SIMULATION_UPDATE_STEP', {
        id: this.simulation._id,
        step: this.step,
        content: {
          metadata: {
            model: JSON.stringify(this.model),
          },
        },
      });
    },
  },
};
