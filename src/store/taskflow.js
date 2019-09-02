import Vue from 'vue';

export default {
  state: {
    pending: {},
    taskflowMapById: {},
    taskflowMapByTaskId: {},
    taskflowMapByJobId: {},
  },
  getters: {
    TASKFLOW_GET_BY_ID(state) {
      return (id) => state.taskflowMapById[id];
    },
    TASKFLOW_GET_BY_TASK_ID(state) {
      return (id) => state.taskflowMapByTaskId[id];
    },
    TASKFLOW_PENDING_GET(state) {
      return (id) => state.pending[id];
    },
  },
  mutations: {
    TASKFLOW_PENDING_SET(state, { id, pending }) {
      if (pending) {
        Vue.set(state.pending, id, true);
      } else {
        Vue.delete(state.pending, id);
      }
    },
    TASKFLOW_SET(state, { taskflow, metadata }) {
      const id = taskflow._id;
      const previousContent = state.taskflowMapById[id];
      const previousTaskflow = previousContent ? previousContent.flow : {};
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
      if (metadata) {
        Object.keys(metadata).forEach((key) => {
          newContent[key] = metadata[key]; // FIXME??? == undefined ? newContent[key] : metadata[key];
        });
      }

      state.taskflowMapById = Object.assign({}, state.taskflowMapById, {
        [id]: newContent,
      });
    },
    TASKFLOW_LOG_APPEND(state, { id, logEntry }) {
      const taskflow = state.taskflowMapById[id];
      if (!taskflow) {
        return;
      }
      if (!taskflow.log) {
        taskflow.log = [];
      }
      taskflow.log.push(logEntry);
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_LOG_SET(state, { id, log }) {
      const taskflow = state.taskflowMapById[id];
      taskflow.log = log;
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_STATUS_SET(state, { id, status }) {
      const taskflow = state.taskflowMapById[id];
      if (taskflow) {
        taskflow.flow.status = status;
        Vue.set(state.taskflowMapById, id, taskflow);
      }
    },
    TASKFLOW_JOB_LOG_APPEND(state, { id, jobId, logEntry }) {
      const taskflow = state.taskflowMapById[id];
      const job = taskflow.jobMapById[jobId];
      job.log.push(logEntry);
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_JOB_LOG_SET(state, { id, jobId, log }) {
      const taskflow = state.taskflowMapById[id];
      const job = taskflow.jobMapById[jobId];
      job.log = log || [];
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_TASK_LOG_APPEND(state, { id, taskId, logEntry }) {
      const taskflow = state.taskflowMapById[id];
      const task = taskflow.taskMapById[taskId];
      task.log.push(logEntry);
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_TASK_LOG_SET(state, { id, taskId, log }) {
      const taskflow = state.taskflowMapById[id];
      const task = taskflow.taskMapById[taskId];
      task.log = log || [];
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_JOB_STATUS_SET(state, { id, jobId, status }) {
      const taskflow = state.taskflowMapById[id];
      const job = taskflow.jobMapById[jobId];
      if (job.status !== status) {
        job.status = status;
        Vue.set(state.taskflowMapById, id, taskflow);
      }
    },
    TASKFLOW_TASKS_SET(state, { id, tasks = [] }) {
      const taskMapById = {};
      const taskflowMapByTaskId = {};

      tasks.forEach((task) => {
        taskMapById[task._id] = task;
        taskflowMapByTaskId[task._id] = id;
      });

      // Update taskflow in map
      const taskflow = state.taskflowMapById[id];
      if (taskflow) {
        taskflow.taskMapById = taskMapById;
        state.taskflowMapById = Object.assign({}, state.taskflowMapById, {
          [id]: taskflow,
        });

        // Update taskId/taskflow map
        state.taskflowMapByTaskId = Object.assign(
          {},
          state.taskflowMapByTaskId,
          taskflowMapByTaskId
        );
      } else {
        console.error(
          `Try to set tasks (${tasks.length}) to taskflow ${id} but none found`
        );
      }
    },
    TASKFLOW_TASK_STATUS_SET(state, { id, taskId, status }) {
      const taskflow = state.taskflowMapById[id];
      const task = taskflow.taskMapById[taskId];

      if (task && task.status !== status) {
        task.status = status;
        Vue.set(state.taskflowMapById, id, taskflow);
      }
    },
    TASKFLOW_SIMULATION_SET(state, { id, simulationId, stepName }) {
      const taskflow = state.taskflowMapById[id];
      taskflow.simulation = simulationId;
      taskflow.stepName = stepName;
      Vue.set(state.taskflowMapById, id, taskflow);
    },
    TASKFLOW_DELETE(state, id) {
      const taskflowMapByTaskId = {};
      const taskflowMapByJobId = {};

      // Handle task map
      Object.keys(state.taskflowMapByTaskId).forEach((taskId) => {
        if (state.taskflowMapByTaskId[taskId] !== id) {
          taskflowMapByTaskId[taskId] = state.taskflowMapByTaskId[taskId];
        }
      });
      state.taskflowMapByTaskId = taskflowMapByTaskId;

      // Handle job map
      Object.keys(state.taskflowMapByJobId).forEach((jobId) => {
        if (state.taskflowMapByJobId[jobId] !== id) {
          taskflowMapByJobId[jobId] = state.taskflowMapByJobId[jobId];
        }
      });
      state.taskflowMapByJobId = taskflowMapByJobId;

      // Handle taskflow
      Vue.delete(state.taskflowMapById, id);
    },
    TASKFLOW_METADATA_SET(state, { id, metadata }) {
      const taskflow = state.taskflowMapById[id];
      taskflow.metadata = metadata;
      Vue.set(state.taskflowMapById, id, taskflow);
    },
  },
  actions: {
    async TASKFLOW_LOG_FETCH({ commit, dispatch }, id) {
      const {
        data: { log },
      } = await dispatch('HTTP_TASKFLOWS_GET_LOG', { id });
      commit('TASKFLOW_LOG_SET', { id, log });
      return log;
    },
    async TASKFLOW_JOB_LOG_FETCH({ commit, dispatch }, { id, jobId }) {
      const {
        data: { log },
      } = await dispatch('HTTP_JOBS_GET_LOG', { id: jobId });
      commit('TASKFLOW_JOB_LOG_SET', { id, jobId, log });
      return log;
    },
    async TASKFLOW_JOB_STATUS_FETCH(
      { commit, dispatch },
      { id, jobId, status = null }
    ) {
      if (status) {
        commit('TASKFLOW_JOB_STATUS_SET', { id, jobId, status });
        return status;
      }
      const { data } = await dispatch('HTTP_JOBS_GET_STATUS', jobId);
      commit('TASKFLOW_JOB_STATUS_SET', { id, jobId, status: data.status });
      return data.status;
    },
    async TASKFLOW_START(
      { commit, dispatch },
      { id, payload, simulationStep }
    ) {
      await dispatch('HTTP_TASKFLOWS_START', { id, cluster: payload });
      if (simulationStep) {
        const content = Object.assign({}, simulationStep.data);
        content.metadata = Object.assign({}, simulationStep.data.metadata, {
          taskflowId: id,
        });

        const { data } = await dispatch('HTTP_SIMULATIONS_UPDATE_STEP', {
          id: simulationStep.id,
          step: simulationStep.step,
          content,
        });
        commit('SIMULATION_SET', data);
      } else {
        console.log('no simulationStep', simulationStep);
      }
    },
    async TASKFLOW_DELETE(
      { getters, dispatch, commit },
      { id, simulationStep }
    ) {
      const pendingId = `${id}_delete`;
      if (getters.TASKFLOW_PENDING_GET(pendingId)) {
        return;
      }
      const taskflow = getters.TASKFLOW_GET_BY_ID(id);
      commit('TASKFLOW_PENDING_SET', { id: pendingId, pending: true });
      try {
        await dispatch('HTTP_TASKFLOWS_DELETE', { id });
      } catch (error) {
        // the server might already know that taskflow does not exist
      }
      commit('TASKFLOW_DELETE', id);
      if (simulationStep) {
        await dispatch('SIMULATION_UPDATE_STEP', {
          id: simulationStep.id,
          step: simulationStep.step,
          content: simulationStep.data,
        });
      } else if (taskflow && taskflow.simulation) {
        const simulation = await dispatch(
          'SIMULATION_FETCH',
          taskflow.simulation
        );
        dispatch('SIMULATION_TASKFLOWS_FETCH', simulation);
      }
      commit('TASKFLOW_PENDING_SET', { id: pendingId, pending: false });
    },
    async TASKFLOW_CREATE(
      { commit, dispatch },
      { taskFlowName, primaryJob, payload, simulationStep }
    ) {
      // Create taskflow and store it locally
      const { data: taskflow } = await dispatch(
        'HTTP_TASKFLOWS_CREATE',
        taskFlowName
      );
      commit('TASKFLOW_SET', {
        taskflow,
        metadata: {
          primaryJob,
          simulation: simulationStep.id,
          stepName: simulationStep.step,
        },
      });
      commit('TASKFLOW_SIMULATION_SET', {
        id: taskflow._id,
        simulationId: simulationStep.id,
        stepName: simulationStep.step,
      });

      // start the taskflow
      await dispatch('TASKFLOW_START', {
        id: taskflow._id,
        payload,
        simulationStep,
      });

      return taskflow;
    },
    async TASKFLOW_TASKS_FETCH({ getters, commit, dispatch }, id) {
      const pendingId = `${id}_tasks_fetch`;
      if (getters.TASKFLOW_PENDING_GET(pendingId)) {
        console.log('skip pending');
        return [];
      }
      const { data: tasks } = await dispatch('HTTP_TASKFLOWS_GET_TASKS', {
        id,
      });
      commit('TASKFLOW_TASKS_SET', { id, tasks });
      commit('TASKFLOW_PENDING_SET', { id: pendingId, pending: false });
      return tasks;
    },
    async TASKFLOW_FETCH_UPDATE({ state, dispatch }) {
      const { taskflowMapById } = state;
      Object.keys(taskflowMapById).forEach(async (taskflowId) => {
        if (
          taskflowMapById[taskflowId].status !== 'complete' &&
          taskflowMapById[taskflowId].status !== 'terminated'
        ) {
          try {
            await dispatch('TASKFLOW_FETCH', taskflowId);
          } catch (error) {
            console.error('TASKFLOW_FETCH_BY_JOB_ID', error);
            dispatch('TASKFLOW_DELETE', { id: taskflowId });
          }
        }
      });
    },
    async TASKFLOW_FETCH({ commit, getters, dispatch }, id) {
      const { data: taskflow } = await dispatch('HTTP_TASKFLOWS_GET', { id });
      commit('TASKFLOW_SET', { taskflow });
      dispatch('TASKFLOW_TASKS_FETCH', id);

      if (taskflow.meta) {
        if (taskflow.meta.jobs) {
          taskflow.meta.jobs.forEach((job) => {
            if (job.status !== 'complete' && job.status !== 'terminated') {
              dispatch('TASKFLOW_JOB_STATUS_FETCH', { id, jobId: job._id });
              dispatch('TASKFLOW_JOB_LOG_FETCH', { id, jobId: job._id });
            }
          });
        }

        // FIXME... implement clusters
        // if (taskflow.meta.cluster) {
        //   clusterActions.fetchClusters();
        // }
      }
      return getters.TASKFLOW_GET_BY_ID(id);
    },
    async TASKFLOW_TERMINATE({ dispatch }, id) {
      const { data } = await dispatch('HTTP_TASKFLOWS_TERMINATE', { id });
      return data;
    },
  },
};
