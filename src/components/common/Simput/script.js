import WorkflowContent from 'simput/src/components/core/WorkflowContent';
import WorkflowMenu from 'simput/src/components/core/WorkflowMenu';

export default {
  name: 'hpcSimput',
  components: {
    WorkflowContent,
    WorkflowMenu,
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    model: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    const { type, model } = this;
    this.$store.dispatch('SIMPUT_CONFIGURE', { type, model });
  },
};
