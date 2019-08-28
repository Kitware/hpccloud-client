import { mapGetters } from 'vuex';

// manipulates target's status count
function statusCounter(source, target) {
  Object.keys(source).forEach((id) => {
    const status = source[id].status;
    if (target[status]) {
      target[status] += 1;
    } else {
      target[status] = 1;
    }
  });
}

const STATUS_COMPLETE = ({ status }) => status === 'complete';
const STATUS_TERMINATED = ({ status }) => status === 'terminated';
const STATUS_ERROR = ({ status }) => status === 'error';
const STATUS_RUNNING = ({ status }) => status === 'running';
const STATUS_TERMINATING = ({ status }) => status === 'terminating';

const ACTION_LABELS = {
  rerun: 'Re-Run',
  terminate: 'Terminate',
};

export default {
  name: 'hpcJobMonitoring',
  props: {
    project: {
      type: Object,
      default: null,
    },
    simulation: {
      type: Object,
      default: null,
    },
    workflow: {
      type: Object,
      default: null,
    },
    taskflowId: {
      type: String,
      default: null,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    actionToLabel: {
      type: Function,
      default(a) {
        return a;
      },
    },
  },
  data() {
    return {
      openSections: [true, true],
    };
  },
  computed: {
    ...mapGetters({
      taskflowById: 'TASKFLOW_GET_BY_ID',
    }),
    taskflow() {
      const taskflow = this.taskflowById(this.taskflowId);
      this.$emit('taskflowChange', taskflow);
      return taskflow;
    },
    tasks() {
      let list = [];
      if (this.taskflow && this.taskflow.taskMapById) {
        list = Object.values(this.taskflow.taskMapById);
      }

      // Sort the tasks by created timestamp
      list.sort((task1, task2) => task1.created - task2.created);

      this.$emit('tasksChange', list);
      return list;
    },
    jobs() {
      let list = [];
      if (this.taskflow && this.taskflow.jobMapById) {
        list = Object.values(this.taskflow.jobMapById);
      }

      this.$emit('jobsChange', list);
      return list;
    },
    log() {
      return this.taskflow ? this.taskflow.log : [];
    },
    status() {
      return this.taskflow ? this.taskflow.flow.status : '';
    },
    taskStatusSummary() {
      const summary = {};
      if (this.taskflow && this.taskflow.taskMapById) {
        statusCounter(this.taskflow.taskMapById, summary);
      }
      return summary;
    },
    jobStatusSummary() {
      const summary = {};
      if (this.taskflow && this.taskflow.jobMapById) {
        statusCounter(this.taskflow.jobMapById, summary);
      }
      return summary;
    },
    allComplete() {
      const allComplete =
        this.jobs.every(STATUS_COMPLETE) && this.tasks.every(STATUS_COMPLETE);
      this.$emit('allCompleteChange', allComplete);
      return allComplete;
    },
    actionList() {
      const actionList = [];
      const { taskflow, jobs, tasks, allComplete } = this;
      const jobsEveryTerminated = jobs.every(STATUS_TERMINATED);
      const jobsSomeTerminating = jobs.some(STATUS_TERMINATING);
      const tasksSomeError = tasks.some(STATUS_ERROR);
      const jobsNotRunning = jobs.length === 0 || !jobs.some(STATUS_RUNNING);
      const workCount = jobs.length + tasks.length;

      if (jobsEveryTerminated || (tasksSomeError && jobsNotRunning)) {
        actionList.push('rerun');
      } else if (!allComplete && workCount > 0 && !jobsSomeTerminating) {
        // Only allow termination if the cluster is not launching/provisioning
        // => we can't currently terminate a cluster in launching or provisioning
        const clusterStatus =
          taskflow.flow.meta &&
          taskflow.flow.meta.cluster &&
          taskflow.flow.meta.cluster.status;
        if (['launching', 'provisioning'].indexOf(clusterStatus) === -1) {
          actionList.push('terminate');
        }
      }

      // Add user action
      this.actions.forEach((action) => {
        if (actionList.indexOf(action) === -1) {
          actionList.push(action);
        }
      });

      return actionList;
    },
    // missing
    // - cluster (name, status, log)
    // - volume (id, name, status, log)
  },
  methods: {
    terminate() {
      this.$store.dispatch('TASKFLOW_TERMINATE', this.taskflowId);
    },
    onAction(action) {
      if (this[action]) {
        this[action]();
      } else {
        this.$emit(action);
      }
    },
  },
  filters: {
    actionLabel(v) {
      return ACTION_LABELS[v] || v;
    },
  },
};
