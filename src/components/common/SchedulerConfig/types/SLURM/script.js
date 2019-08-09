const KEYS = ['numberOfGpusPerNode', 'numberOfCoresPerNode', 'numberOfNodes'];

export default {
  name: 'hpcSchedulerSLURM',
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
  updated() {
    if (this.onChange) {
      const slurm = {};
      KEYS.forEach((key) => {
        slurm[key] = Number(this[key]);
      });
      this.onChange('slurm', slurm);
    }
  },
};
