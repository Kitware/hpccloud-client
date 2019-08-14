import { LABELS, COMPONENTS, KEYS } from './types';

export default {
  name: 'hpcSchedulerConfig',
  props: {
    scheduler: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      labels: LABELS,
      type: KEYS[0],
      types: KEYS,
      maxWallTime: { hours: 0, minutes: 0, seconds: 0 },
      queue: '',
      parallelEnvironment: null,
    };
  },
  computed: {
    items() {
      return this.types.map((value) => ({ value, text: LABELS[value] }));
    },
    schedulerComponent() {
      return COMPONENTS[this.scheduler || this.type];
    },
  },
  methods: {
    onChange(name, value) {
      const { maxWallTime, queue, parallelEnvironment } = this;
      const content = Object.assign({}, value, {
        maxWallTime,
        queue,
        parallelEnvironment,
      });

      // Payload cleanup
      content.maxWallTime.hours = Number(content.maxWallTime.hours || 0);
      content.maxWallTime.minutes = Number(content.maxWallTime.hours || 0);
      content.maxWallTime.seconds = Number(content.maxWallTime.hours || 0);
      if (!content.parallelEnvironment) {
        delete content.parallelEnvironment;
      }
      if (
        !(
          content.maxWallTime.hours +
          content.maxWallTime.minutes +
          content.maxWallTime.seconds
        )
      ) {
        delete content.maxWallTime;
      }

      // Capture changes
      this[name] = value;

      // Let the work know
      this.$emit('change', {
        type: name,
        [name]: content,
      });
    },
  },
};
