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
  },
  data() {
    return {
      openSections: [true],
    };
  },
  computed: {
    ...mapGetters({
      taskflowById: 'TASKFLOW_GET_BY_ID',
    }),
    taskflow() {
      return this.taskflowById(this.taskflowId);
    },
    tasks() {
      let list = [];
      if (this.taskflow && this.taskflow.taskMapById) {
        list = Object.values(this.taskflow.taskMapById);
      }

      // Sort the tasks by created timestamp
      list.sort((task1, task2) => task1.created - task2.created);

      return list;
    },
    jobs() {
      let list = [];
      if (this.taskflow && this.taskflow.jobMapById) {
        list = Object.values(this.taskflow.jobMapById);
      }

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
    // missing
    // - cluster (name, status, log)
    // - volume (id, name, status, log)
  },
};
