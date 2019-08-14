const KEYS = ['numberOfGpusPerNode', 'numberOfCoresPerNode', 'numberOfNodes'];

export default {
  name: 'hpcSchedulerPBS',
  props: {
    onChange: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      numberOfGpusPerNode: 0,
      numberOfCoresPerNode: 1,
      numberOfNodes: 1,
    };
  },
  mounted() {
    this.pushState();
  },
  updated() {
    this.pushState();
  },
  methods: {
    pushState() {
      if (this.onChange) {
        const pbs = {};
        KEYS.forEach((key) => {
          pbs[key] = Number(this[key]);
        });
        this.onChange('pbs', pbs);
      }
    },
  },
};
