export default {
  name: 'hpcStatusSummary',
  props: {
    summary: {
      type: Object,
      default: null,
    },
    order: {
      type: Array,
      default() {
        return [
          'created',
          'pending',
          'queued',
          'running',
          'complete',
          'completed',
          'terminating',
          'terminated',
        ];
      },
    },
  },
};
