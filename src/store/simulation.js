import Vue from 'vue';
import get from 'hpccloud-client/src/utils/get';

export default {
  state: {
    projects: [],
    projectsMap: {},
    projectSimulations: {},
    simulationsMap: {},
  },
  getters: {
    PROJECTS(state) {
      return state.projects;
    },
    PROJECT_BY_ID(state) {
      return (id) => state.projectsMap[id];
    },
    SIMULATION_BY_ID(state) {
      return (id) => state.simulationsMap[id];
    },
    SIMULATIONS_BY_PROJECT_ID(state) {
      return (id) =>
        (state.projectSimulations[id] || []).map(
          (sid) => state.simulationsMap[sid]
        );
    },
  },
  mutations: {
    PROJECTS_SET(state, projects) {
      const projectsMap = {};
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        projectsMap[project._id] = project;
      }

      state.projects = projects;
      state.projectsMap = projectsMap;
    },
    PROJECT_SET(state, project) {
      const id = project._id;
      const projectsMap = Object.assign({}, state.projectsMap);
      projectsMap[id] = project;
      const projects = state.projects
        .filter((p) => p._id !== id)
        .concat(project);

      state.projects = projects;
      state.projectsMap = projectsMap;
    },
    PROJECT_SET_SIMULATIONS(state, simulations) {
      const contentToUpdate = {};
      const ids = [];
      let projectId = simulations[0].projectId;
      for (let i = 0; i < simulations.length; i++) {
        const simulation = simulations[i];
        const { _id: id } = simulation;
        contentToUpdate[id] = simulation;
        ids.push(id);
      }
      state.simulationsMap = Object.assign(
        {},
        state.simulationsMap,
        contentToUpdate
      );
      Vue.set(state.projectSimulations, projectId, ids);
    },
    SIMULATION_SET(state, simulation) {
      Vue.set(state.simulationsMap, simulation._id, simulation);
    },
  },
  actions: {
    PROJECTS_CLEAR({ state }) {
      state.projects = [];
      state.projectsMap = {};
      state.projectSimulations = {};
      state.simulationsMap = {};
    },

    async SIMULATION_FETCH({ commit, dispatch }, id) {
      const { data } = await dispatch('HTTP_SIMULATIONS_GET_BY_ID', id);
      commit('SIMULATION_SET', data);
      return data;
    },
    async SIMULATION_UPDATE_STEP(
      { state, commit, dispatch },
      { id, step, content }
    ) {
      const { data } = await dispatch('HTTP_SIMULATIONS_UPDATE_STEP', {
        id,
        step,
        content,
      });

      const previousTaskflowId = get(
        state,
        `simulationsMap.${id}.steps.${step}.metadata.taskflowId`
      );
      const nextTaskflowId = get(content, `metadata.taskflowId`);

      // if taskflow different trigger delete of the old one
      if (previousTaskflowId !== nextTaskflowId) {
        dispatch('TASKFLOW_DELETE', { id: previousTaskflowId });
      }

      commit('SIMULATION_SET', data);
      return data;
    },
    async SIMULATION_UPDATE_ACTIVE_STEP({ commit, dispatch }, { id, active }) {
      const { data } = await dispatch('HTTP_SIMULATIONS_UPDATE', {
        id,
        content: { active },
      });
      commit('SIMULATION_SET', data);
      return data;
    },
    async SIMULATION_TASKFLOWS_FETCH({ commit, dispatch }, simulation) {
      const simulationId = simulation._id;
      Object.keys(simulation.steps).forEach(async (stepName) => {
        const id = get(simulation.steps[stepName], 'metadata.taskflowId');
        if (id) {
          await dispatch('TASKFLOW_FETCH', id);
          commit('TASKFLOW_SIMULATION_SET', { id, simulationId, stepName });
        }
      });
    },
  },
};
