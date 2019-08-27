function filterQuery(query = {}, ...keys) {
  const out = {};
  keys.forEach((key) => {
    if (query[key] !== undefined && query[key] !== null) {
      out[key] = query[key];
    }
  });
  return out;
}

export default {
  state: {
    apiRoot: '',
    girderClient: null,
    eventSource: null,
  },
  getters: {
    HTTP_CLIENT(state) {
      return state.girderClient;
    },
  },
  mutations: {
    HTTP_CLIENT_SET(state, value) {
      state.girderClient = value;
      state.apiRoot = value.apiRoot;
    },
  },
  actions: {
    // --- EVENTS -------------------------------------------------------------
    HTTP_CONNECT_EVENTS({ state, dispatch }) {
      dispatch('HTTP_DISCONNECT_EVENTS');
      if (EventSource && !state.eventSource) {
        state.eventSource = new EventSource(
          `${state.apiRoot}/notification/stream`
        );
        state.eventSource.onmessage = ({ data }) => {
          dispatch('HTTP_EVENT', JSON.parse(data));
        };
        state.eventSource.onerror = () => {
          // Wait 2 seconds if the browser hasn't reconnected then reinitialize.
          setTimeout(() => {
            dispatch('HTTP_CONNECT_EVENTS');
          }, 2000);
        };
      }
    },
    HTTP_DISCONNECT_EVENTS({ state }) {
      if (
        state.eventSource &&
        state.eventSource.readyState !== EventSource.CLOSED
      ) {
        state.eventSource.close();
      }
      state.eventSource = null;
    },
    HTTP_EVENT({ dispatch }, message) {
      const {
        type,
        data: { _id: id, status, log },
      } = message;
      if (status) {
        dispatch('EVENTS_STATUS', { id, type, status });
      } else if (log) {
        dispatch('EVENTS_LOG', { id, type, log });
      } else if (type === 'progress') {
        // progress
        console.log(
          `progress ${message.current}/${message.total} - ${(
            (100 * message.current) /
            message.total
          ).toFixed(0)}%`
        );
      }
    },
    // --- LOGIN --------------------------------------------------------------
    HTTP_LOGOUT({ state, dispatch }) {
      dispatch('HTTP_DISCONNECT_EVENTS');
      state.girderClient.logout();
    },
    // --- PROJECTS -----------------------------------------------------------
    async HTTP_PROJECTS_LIST({ state }) {
      return await state.girderClient.get('projects');
    },
    async HTTP_PROJECTS_CREATE({ state }, project) {
      return await state.girderClient.post('projects', project);
    },
    async HTTP_PROJECTS_GET_BY_ID({ state }, id) {
      return await state.girderClient.get(`projects/${id}`);
    },
    async HTTP_PROJECTS_UPDATE({ state }, project) {
      return await state.girderClient.patch(`projects/${project._id}`, project);
    },
    async HTTP_PROJECTS_DELETE({ state }, id) {
      return await state.girderClient.delete(`projects/${id}`);
    },
    async HTTP_PROJECTS_GET_ACCESS({ state }, id) {
      return await state.girderClient.get(`projects/${id}/access`);
    },
    async HTTP_PROJECTS_SET_ACCESS(
      { state },
      { id, users, groups, level = 0, flags = [] }
    ) {
      return await state.girderClient.put(`projects/${id}/access`, {
        users,
        groups,
        level: parseInt(level, 10),
        flags,
      });
    },
    async HTTP_PROJECTS_PATCH_ACCESS(
      { state },
      { id, users, groups, level = 0, flags = [] }
    ) {
      return await state.girderClient.patch(`projects/${id}/access`, {
        users,
        groups,
        level: parseInt(level, 10),
        flags,
      });
    },
    async HTTP_PROJECTS_REVOKE_ACCESS({ state }, { id, users, groups }) {
      return await state.girderClient.patch(`projects/${id}/access/revoke`, {
        users,
        groups,
      });
    },
    async HTTP_PROJECTS_GET_SIMULATION_LIST({ state }, id) {
      return await state.girderClient.get(`projects/${id}/simulations`);
    },
    // --- SIMULATIONS --------------------------------------------------------
    async HTTP_SIMULATIONS_CREATE({ state }, { id, simulation }) {
      return await state.girderClient.post(
        `/projects/${id}/simulations`,
        simulation
      );
    },
    async HTTP_SIMULATIONS_GET_BY_ID({ state }, id) {
      return await state.girderClient.get(`simulations/${id}`);
    },
    async HTTP_SIMULATIONS_UPDATE({ state }, { id, content }) {
      return await state.girderClient.patch(`simulations/${id}`, content);
    },
    async HTTP_SIMULATIONS_DELETE({ state }, id) {
      return await state.girderClient.delete(`simulations/${id}`);
    },
    async HTTP_SIMULATIONS_CLONE(
      { state },
      { id, name = 'Cloned simulation' }
    ) {
      return await state.girderClient.post(`simulations/${id}/clone`, { name });
    },
    async HTTP_SIMULATIONS_DOWNLOAD({ state }, id) {
      return await state.girderClient.get(`simulations/${id}/download`);
    },
    async HTTP_SIMULATIONS_GET_STEP({ state }, { id, name }) {
      return await state.girderClient.get(`simulations/${id}/steps/${name}`);
    },
    async HTTP_SIMULATIONS_UPDATE_STEP({ state }, { id, step, content }) {
      const payload = Object.assign({}, content);
      // Remove read-only keys
      ['type', 'folderId'].forEach((key) => {
        delete payload[key];
      });

      return await state.girderClient.patch(
        `simulations/${id}/steps/${step}`,
        payload
      );
    },
    async HTTP_SIMULATIONS_GET_ACCESS({ state }, id) {
      return await state.girderClient.get(`simulations/${id}/access`);
    },
    async HTTP_SIMULATIONS_SET_ACCESS(
      { state },
      { id, users, groups, level = 0, flags = [] }
    ) {
      return await state.girderClient.put(`simulations/${id}/access`, {
        users,
        groups,
        level: parseInt(level, 10),
        flags,
      });
    },
    async HTTP_SIMULATIONS_PATCH_ACCESS(
      { state },
      { id, users, groups, level = 0, flags = [] }
    ) {
      return await state.girderClient.patch(`simulations/${id}/access`, {
        users,
        groups,
        level: parseInt(level, 10),
        flags,
      });
    },
    async HTTP_SIMULATIONS_REVOKE_ACCESS({ state }, { id, users, groups }) {
      return await state.girderClient.patch(`simulations/${id}/access/revoke`, {
        users,
        groups,
      });
    },
    // --- TASKFLOWS ----------------------------------------------------------
    async HTTP_TASKFLOWS_CREATE({ state }, taskFlowClass) {
      return await state.girderClient.post('taskflows', { taskFlowClass });
    },
    async HTTP_TASKFLOWS_GET({ state }, { id, path }) {
      if (path) {
        return await state.girderClient.get(`taskflows/${id}?path=${path}`);
      }
      return await state.girderClient.get(`taskflows/${id}`);
    },
    async HTTP_TASKFLOWS_UPDATE({ state }, { id, content }) {
      return await state.girderClient.patch(`taskflows/${id}`, content);
    },
    async HTTP_TASKFLOWS_DELETE({ state }, { id }) {
      return await state.girderClient.delete(`taskflows/${id}`);
    },
    async HTTP_TASKFLOWS_GET_LOG({ state }, { id, offset = 0 }) {
      if (offset) {
        return await state.girderClient.get(
          `taskflows/${id}/log?offset=${offset}`
        );
      }
      return await state.girderClient.get(`taskflows/${id}/log`);
    },
    async HTTP_TASKFLOWS_START({ state }, { id, cluster }) {
      return await state.girderClient.put(`taskflows/${id}/start`, cluster);
    },
    async HTTP_TASKFLOWS_STATUS({ state }, { id }) {
      return await state.girderClient.get(`taskflows/${id}/status`);
    },
    async HTTP_TASKFLOWS_GET_TASKS({ state }, { id }) {
      return await state.girderClient.get(`taskflows/${id}/tasks`);
    },
    async HTTP_TASKFLOWS_CREATE_TASK({ state }, { id, content }) {
      return await state.girderClient.post(`taskflows/${id}/tasks`, content);
    },
    async HTTP_TASKFLOWS_TERMINATE({ state }, { id }) {
      return await state.girderClient.put(`taskflows/${id}/terminate`);
    },
    async HTTP_TASKFLOWS_SHARE({ state }, { id, user = [], groups = [] }) {
      return await state.girderClient.patch(`taskflows/${id}/access`, {
        user,
        groups,
      });
    },
    async HTTP_TASKFLOWS_UNSHARE({ state }, { id, user = [], groups = [] }) {
      return await state.girderClient.patch(`taskflows/${id}/access/revoke`, {
        user,
        groups,
      });
    },
    // --- TASKS --------------------------------------------------------------
    async HTTP_TASKS_GET({ state }, { id }) {
      return await state.girderClient.get(`tasks/${id}`);
    },
    async HTTP_TASKS_GET_LOG({ state }, { id }) {
      return await state.girderClient.get(`tasks/${id}/log`);
    },
    async HTTP_TASKS_GET_STATUS({ state }, { id }) {
      return await state.girderClient.get(`tasks/${id}/status`);
    },
    async HTTP_TASKS_UPDATE({ state }, { id, content }) {
      return await state.girderClient.patch(`tasks/${id}`, content);
    },
    // --- JOBS ---------------------------------------------------------------
    async HTTP_JOBS_GET({ state }, { offset = 0, limit = 0 }) {
      const query = [];
      if (offset) {
        query.push(`offset=${offset}`);
      }
      if (limit) {
        query.push(`limit=${limit}`);
      }
      if (query.length) {
        return await state.girderClient.get(`jobs?${query.join('&')}`);
      }
      return await state.girderClient.get('jobs');
    },
    async HTTP_JOBS_CREATE({ state }, job) {
      return await state.girderClient.post('jobs', job);
    },
    async HTTP_JOBS_GET_BY_ID({ state }, id) {
      return await state.girderClient.get(`jobs/${id}`);
    },
    async HTTP_JOBS_UPDATE({ state }, { id, content }) {
      return await state.girderClient.patch(`jobs/${id}`, content);
    },
    async HTTP_JOBS_DELETE({ state }, id) {
      return await state.girderClient.delete(`jobs/${id}`);
    },
    async HTTP_JOBS_GET_LOG({ state }, { id, offset = 0 }) {
      return await state.girderClient.get(
        offset ? `jobs/${id}/log?offset=${offset}` : `jobs/${id}/log`
      );
    },
    async HTTP_JOBS_GET_OUTPUT({ state }, { id, path, offset = 0 }) {
      return await state.girderClient.get(
        offset
          ? `jobs/${id}/log?path=${path}&offset=${offset}`
          : `jobs/${id}/log?path=${path}`
      );
    },
    async HTTP_JOBS_GET_STATUS({ state }, id) {
      return await state.girderClient.get(`jobs/${id}/status`);
    },
    async HTTP_JOBS_TERMINATE({ state }, id) {
      return await state.girderClient.put(`jobs/${id}/terminate`);
    },
    // --- VOLUMES ------------------------------------------------------------
    async HTTP_VOLUMES_LIST({ state }, limit = 0) {
      return await state.girderClient.get(
        limit ? `volumes?limit=${limit}` : 'volumes'
      );
    },
    async HTTP_VOLUMES_CREATE({ state }, volume) {
      return await state.girderClient.post('volumes', volume);
    },
    async HTTP_VOLUMES_GET({ state }, id) {
      return await state.girderClient.get(`volumes/${id}`);
    },
    async HTTP_VOLUMES_DELETE({ state }, id) {
      return await state.girderClient.delete(`volumes/${id}`);
    },
    async HTTP_VOLUMES_GET_LOG({ state }, { id, offset = 0 }) {
      const addOn = offset ? `?offset=${offset}` : '';
      return await state.girderClient.get(`volumes/${id}/log${addOn}`);
    },
    async HTTP_VOLUMES_GET_STATUS({ state }, id) {
      return await state.girderClient.get(`volumes/${id}/status`);
    },
    async HTTP_VOLUMES_ATTACH({ state }, { id, cluster }) {
      return await state.girderClient.get(`volumes/${id}/attach/${cluster}`);
    },
    async HTTP_VOLUMES_DETACH({ state }, id) {
      return await state.girderClient.get(`volumes/${id}/detach`);
    },
    // --- CLUSTERS -----------------------------------------------------------
    async HTTP_CLUSTERS_LIST({ state }, type) {
      return await state.girderClient.get(
        type ? `clusters?type=${type}` : 'clusters'
      );
    },
    async HTTP_CLUSTERS_CREATE({ state }, cluster) {
      return await state.girderClient.post('clusters', cluster);
    },
    async HTTP_CLUSTERS_GET({ state }, id) {
      return await state.girderClient.get(`clusters/${id}`);
    },
    async HTTP_CLUSTERS_GET_PRESETS() {
      const response = await fetch('/clusters-presets.json');
      return await response.json();
    },
    async HTTP_CLUSTERS_UPDATE({ state }, cluster) {
      const content = filterQuery(cluster, 'name', 'type', 'config');

      // Remove read only fields if any
      if (content.config.ssh && content.config.ssh.user) {
        content.config.ssh = Object.assign({}, content.config.ssh);
        delete content.config.ssh.user;
      }
      if (content.config.host) {
        content.config = Object.assign({}, content.config);
        delete content.config.host;
      }

      return await state.girderClient.patch(`clusters/${cluster._id}`, content);
    },
    async HTTP_CLUSTERS_DELETE({ state }, id) {
      return await state.girderClient.delete(`clusters/${id}`);
    },
    async HTTP_CLUSTERS_SUBMIT_JOB({ state }, { cluster, job }) {
      return await state.girderClient.put(
        `clusters/${cluster._id}/job/${job._id}/submit`
      );
    },
    async HTTP_CLUSTERS_TASK_LOG({ state }, { id, offset = 0 }) {
      const query = offset ? `?offset=${offset}` : '';
      return await state.girderClient.get(`clusters/${id}/log${query}`);
    },
    async HTTP_CLUSTERS_PROVISION({ state }, { id, content }) {
      return await state.girderClient.put(`clusters/${id}/provision`, content);
    },
    async HTTP_CLUSTERS_START({ state }, id) {
      return await state.girderClient.put(`clusters/${id}/start`);
    },
    async HTTP_CLUSTERS_TEST({ state }, id) {
      // alias of HTTP_CLUSTERS_START
      return await state.girderClient.put(`clusters/${id}/start`);
    },
    async HTTP_CLUSTERS_STATUS({ state }, id) {
      // alias of HTTP_CLUSTERS_START
      return await state.girderClient.get(`clusters/${id}/status`);
    },
    async HTTP_CLUSTERS_TERMINATE({ state }, id) {
      // alias of HTTP_CLUSTERS_START
      return await state.girderClient.put(`clusters/${id}/terminate`);
    },
  },
};
