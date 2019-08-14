const KEYS = ['numberOfGpusPerNode', 'numberOfSlots'];

export default {
  name: 'hpcSchedulerSGE',
  props: {
    onChange: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      numberOfGpusPerNode: 0,
      numberOfSlots: 1,
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
        const sge = {};
        KEYS.forEach((key) => {
          sge[key] = Number(this[key]);
        });
        this.onChange('sge', sge);
      }
    },
  },
};
