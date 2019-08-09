import { LABELS, COMPONENTS, KEYS } from './types';

export default {
  name: 'hpcSchedulerConfig',
  data() {
    return {
      labels: LABELS,
      type: KEYS[0],
      types: KEYS,
      maxWallTime: { hours: 0, minutes: 0, seconds: 0 },
      defaultQueue: '',
    };
  },
  computed: {
    schedulerComponent() {
      return COMPONENTS[this.type];
    },
  },
  methods: {
    onChange(name, value) {
      this[name] = value;
    },
  },
};
