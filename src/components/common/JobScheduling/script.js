import { mapGetters } from 'vuex';

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
    nextView: {
      type: String,
      default: 'run',
    },
  },
  computed: {
    ...mapGetters({
      simulation: 'ACTIVE_SIMULATION',
      workflow: 'ACTIVE_WORKFLOW',
    }),
    step() {
      return this.simulation.active;
    },
    taskFlowName() {
      return this.workflow.taskFlows[this.step];
    },
    primaryJob() {
      return this.workflow.primaryJobs[this.step];
    },
  },
  data() {
    return {
      runtime: RUNTIME_KEYS[0],
      runtimes,
    };
  },
  methods: {
    submitJob(payload) {
      const { taskFlowName, primaryJob, step, simulation } = this;
      const id = simulation._id;

      if (!taskFlowName || !primaryJob || !step) {
        console.error('submitJob', taskFlowName, primaryJob, step);
        return;
      }

      this.$store.dispatch('TASKFLOW_CREATE', {
        taskFlowName,
        primaryJob,
        payload,
        simulationStep: {
          id,
          step,
          data: Object.assign({}, simulation.steps[step], {
            view: this.nextView,
          }),
        },
      });
    },
  },
};
