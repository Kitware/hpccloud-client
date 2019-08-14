import runtimes from 'hpccloud-client/src/runtimes';

const RUNTIME_KEYS = Object.keys(runtimes);
const NoFilter = () => true;
const NoPayload = () => ({ payload: 'invalid as no function were provided' });

export default {
  name: 'hpcJobScheduling',
  props: {
    clusterFilter: {
      type: Function,
      default: NoFilter,
    },
    getPayload: {
      type: Function,
      default: NoPayload,
    },
  },
  data() {
    return {
      runtime: RUNTIME_KEYS[0],
      runtimes,
    };
  },
};
