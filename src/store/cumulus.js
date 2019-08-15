import Vue from 'vue';

export default {
  state: {
    taskflowMap: {},
  },
  mutations: {
    CUMULUS_TASKFLOW_SET(state, { taskflow, metadata }) {
      const previousContent = state.taskflowMap[id];
      const previousTaskflow = previousContent.flow;
      const id = taskflow._id;
      const jobMapById = {};
      const log = taskflow.log || [];

      // Fill jobs
      if (taskflow.meta && taskflow.meta.jobs) {
        taskflow.meta.jobs.forEach((job) => {
          jobMapById[job._id] = job;
          // Keep the previous status if available
          if (
            previousTaskflow &&
            previousTaskflow.jobMapById &&
            previousTaskflow.jobMapById[job._id]
          ) {
            jobMapById[job._id].status =
              previousTaskflow.jobMapById[job._id].status;
          }
        });
      }

      // Create new content
      const newContent = Object.assign({ taskMapId: {} }, previousContent, {
        flow: taskflow,
        jobMapById,
        log,
      });

      // Merge metadata
      Object.keys(metadata).forEach((key) => {
        newContent[key] = metadata[key]; // FIXME??? == undefined ? newContent[key] : metadata[key];
      });

      Vue.set(state.taskflowMap, id, newContent);
    },
  },
  actions: {
    async CUMULUS_TASKFLOW_CREATE(
      { commit, dispatch },
      { taskFlowName, primaryJob, payload, simulationStep }
    ) {
      // Create taskflow and store it locally
      const { data: taskflow } = dispatch('HTTP_TASKFLOWS_CREATE', taskFlowName);
      commit('CUMULUS_TASKFLOW_SET', {
        taskflow,
        metadata: {
          primaryJob,
          simulation: simulationStep.id,
          stepName: simulationStep.step,
        },
      });

      // start the taskflow
      await dispatch('CUMULUS_TASKFLOW_START', { payload, simulationStep });

      return taskflow;
    },
  },
};
