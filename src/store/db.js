import Vue from 'vue';

export default {
  state: {
    projects: [],
    projectsMap: {},
    projectSimulations: {},
    simulationsMap: {},
    projectMTime: 0,
    simulationMTime: 0,
  },
  getters: {
    DB_MTIME_PROJECT(state) {
      return state.projectMTime;
    },
    DB_MTIME_SIMULATION(state) {
      return state.simulationMTime;
    },
    DB_PROJECTS(state) {
      return state.projects;
    },
    DB_PROJECT_BY_ID(state) {
      state.projectMTime;
      return (id) => state.projectsMap[id];
    },
    DB_SIMULATION_BY_ID(state) {
      state.simulationMTime;
      return (id) => state.simulationsMap[id];
    },
    DB_SIMULATIONS_BY_PROJECT_ID(state) {
      return (id) =>
        (state.projectSimulations[id] || []).map(
          (sid) => state.simulationsMap[sid]
        );
    },
  },
  actions: {
    DB_RESET({ state }) {
      state.projects = [];
      state.projectsMap = {};
      state.projectSimulations = {};
      state.simulationsMap = {};
      state.projectMTime = 0;
      state.simulationMTime = 0;
    },
    DB_UPDATE_PROJECTS({ state }, projects) {
      const projectsMap = {};
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        projectsMap[project._id] = project;
      }

      state.projects = projects;
      state.projectsMap = projectsMap;
      state.projectMTime++;
    },
    DB_UPDATE_PROJECT({ state }, project) {
      const id = project._id;
      const projectsMap = Object.assign({}, state.projectsMap);
      projectsMap[id] = project;
      const projects = state.projects
        .filter((p) => p._id !== id)
        .concat(project);

      state.projects = projects;
      state.projectsMap = projectsMap;
      state.projectMTime++;
    },
    DB_UPDATE_SIMULATIONS({ state }, simulations) {
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
      state.simulationMTime++;
    },
    DB_UPDATE_SIMULATION({ state }, simulation) {
      Vue.set(state.simulationsMap, simulation._id, simulation);
      state.simulationMTime++;
    },
  },
};
