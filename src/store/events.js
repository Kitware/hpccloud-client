export default {
  actions: {
    EVENTS_STATUS({ getters, commit, dispatch }, { id, type, status }) {
      console.log('EVENTS_STATUS');
      const taskflowId = getters.TASKFLOW_GET_BY_TASK_ID(id);
      const mainType = type.split('.')[0];
      if (mainType === 'taskflow') {
        commit('TASKFLOW_STATUS_SET', { id, status });
      } else if (taskflowId) {
        switch (mainType) {
          case 'job':
            commit('TASKFLOW_JOB_STATUS_SET', {
              id: taskflowId,
              jobId: id,
              status,
            });
            break;
          case 'task':
            commit('TASKFLOW_TASK_STATUS_SET', {
              id: taskflowId,
              taskId: id,
              status,
            });
            break;
          case 'cluster':
            console.log('need to handle cluster (STATUS with taskflow)');
            break;
          case 'profile':
            console.log('need to handle profile (STATUS with taskflow)');
            break;
          case 'volume':
            console.log('need to handle volume (STATUS with taskflow)');
            break;
          default:
            console.error(
              `unrecognized ServerEvent with type "${mainType}", id "${id}", and status "${status}"`
            );
            break;
        }
      } else {
        switch (mainType) {
          case 'job':
          case 'task':
            dispatch('TASKFLOW_FETCH_UPDATE');
            break;
          case 'cluster':
            console.log('need to handle cluster STATUS');
            break;
          case 'profile':
            console.log('need to handle profile STATUS');
            break;
          case 'volume':
            console.log('need to handle volume STATUS');
            break;
          default:
            console.error(
              `unrecognized ServerEvent with type "${mainType}", id "${id}", and status "${status}"`
            );
            break;
        }
      }
    },
    EVENTS_LOG({ getters, commit, dispatch }, { id, type, log }) {
      console.log('EVENTS_LOG');
      const taskflowId = getters.TASKFLOW_GET_BY_TASK_ID(id);
      const mainType = type.split('.')[0];
      if (mainType === 'taskflow') {
        commit('TASKFLOW_LOG_APPEND', { id, logEntry: log });
      } else if (taskflowId) {
        switch (mainType) {
          case 'job':
            commit('TASKFLOW_JOB_LOG_APPEND', {
              id: taskflowId,
              jobId: id,
              logEntry: log,
            });
            break;
          case 'task':
            commit('TASKFLOW_TASK_LOG_APPEND', {
              id: taskflowId,
              taskId: id,
              logEntry: log,
            });
            break;
          case 'cluster':
            console.log('need to handle cluster (LOG with taskflow)');
            break;
          case 'profile':
            console.log('need to handle profile (LOG with taskflow)');
            break;
          case 'volume':
            console.log('need to handle volume (LOG with taskflow)');
            break;
          default:
            console.error(
              `unrecognized ServerEvent with type "${mainType}", id "${id}", and status "${status}"`
            );
            break;
        }
      } else {
        switch (mainType) {
          case 'job':
          case 'task':
            dispatch('TASKFLOW_FETCH_UPDATE');
            break;
          case 'cluster':
            console.log('need to handle cluster LOG');
            break;
          case 'profile':
            console.log('need to handle profile LOG');
            break;
          case 'volume':
            console.log('need to handle volume LOG');
            break;
          default:
            console.error(
              `unrecognized ServerEvent with type "${mainType}", id "${id}", and status "${status}"`
            );
            break;
        }
      }
    },
  },
};
