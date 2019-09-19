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
      state.projectsMap;
      return (id) => state.projectsMap[id];
    },
    SIMULATION_BY_ID(state) {
      state.simulationsMap;
      return (id) => state.simulationsMap[id];
    },
    SIMULATIONS_BY_PROJECT_ID(state) {
      state.projectSimulations;
      state.simulationsMap;
      return (id) =>
        (state.projectSimulations[id] || []).map(
          (sid) => state.simulationsMap[sid]
        );
      // .filter((i) => i);
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
    PROJECT_REMOVE(state, project) {
      const pid = project._id;
      state.projects = state.projects.filter(({ _id }) => _id !== project._id);

      Vue.delete(state.projectsMap, pid);
      Vue.delete(state.projectSimulations, pid);
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
    PROJECT_SET_SIMULATIONS(state, { projectId, simulations }) {
      const contentToUpdate = {};
      const ids = [];
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
      state.projectSimulations = Object.assign({}, state.projectSimulations, {
        [projectId]: ids,
      });
    },
    SIMULATION_SET(state, simulation) {
      state.simulationsMap = Object.assign({}, state.simulationsMap, {
        [simulation._id]: simulation,
      });
    },
    SIMULATION_REMOVE(state, simulation) {
      const cleaned = Object.assign({}, state.simulationsMap);
      delete cleaned[simulation._id];
      state.simulationsMap = cleaned;
    },
  },
  actions: {
    PROJECTS_CLEAR({ state }) {
      state.projects = [];
      state.projectsMap = {};
      state.projectSimulations = {};
      state.simulationsMap = {};
    },
    async CONTAINER_CREATE_ITEM(
      { dispatch },
      { container, name, file, updateAction }
    ) {
      const { data: item } = await dispatch('HTTP_ITEMS_CREATE', {
        folderId: container.metadata.inputFolder._id,
        name,
      });
      const { data: fileObj } = await dispatch('HTTP_FILES_UPLOAD', {
        parentType: 'item',
        parentId: item._id,
        name: file.name,
        size: file.size,
        file,
      });
      container.metadata.inputFolder.files[name] = fileObj._id;
      const { data: updatedProject } = await dispatch(updateAction, container);
      return updatedProject;
    },
    async PROJECT_CREATE(
      { commit, dispatch },
      { _id, name, desctiption, type, steps, metadata, attachments }
    ) {
      if (_id) {
        // An existing project was provided as arg... Skip creation
        return Promise.reject('Project already exist');
      }
      const { data: project } = await dispatch('HTTP_PROJECTS_CREATE', {
        name,
        desctiption,
        type,
        steps,
        metadata,
      });
      const { data: outputFolder } = await dispatch('HTTP_FOLDERS_CREATE', {
        name: 'output',
        parentType: 'folder',
        parentId: project.folderId,
      });
      const { data: inputFolder } = await dispatch('HTTP_FOLDERS_CREATE', {
        name: 'input',
        parentType: 'folder',
        parentId: project.folderId,
      });
      project.metadata = Object.assign({}, project.metadata, {
        inputFolder: {
          _id: inputFolder._id,
          files: {},
        },
        outputFolder: {
          _id: outputFolder._id,
          files: {},
        },
      });
      const { data: updatedProject } = await dispatch(
        'HTTP_PROJECTS_UPDATE',
        project
      );

      if (attachments) {
        const promises = [];
        Object.keys(attachments).forEach((name) => {
          promises.push(
            dispatch('CONTAINER_CREATE_ITEM', {
              container: project,
              name,
              file: attachments[name],
              updateAction: 'HTTP_PROJECTS_UPDATE',
            })
          );
        });
        await Promise.all(promises);
      }
      commit('PROJECT_SET', updatedProject);
      dispatch('ACTIVATE_PROJECT', updatedProject);
      return updatedProject;
    },
    async PROJECT_UPDATE({ commit, dispatch }, project) {
      const { data: updatedProject } = await dispatch(
        'HTTP_PROJECTS_UPDATE',
        project
      );
      commit('PROJECT_SET', updatedProject);
      return updatedProject;
    },
    async PROJECT_DELETE({ commit, dispatch }, project) {
      await dispatch('HTTP_PROJECTS_DELETE', project._id);
      commit('PROJECT_REMOVE', project);
    },
    async SIMULATION_CREATE(
      { commit, dispatch },
      {
        _id,
        name,
        desctiption,
        steps,
        metadata,
        projectId,
        active,
        disabled,
        attachments,
      }
    ) {
      if (_id) {
        // An existing project was provided as arg... Skip creation
        return Promise.reject('Simulation already exist');
      }
      const { data: simulation } = await dispatch('HTTP_SIMULATIONS_CREATE', {
        name,
        desctiption,
        steps,
        projectId,
        active,
        disabled,
        metadata,
      });
      const { data: outputFolder } = await dispatch('HTTP_FOLDERS_CREATE', {
        name: 'output',
        parentType: 'folder',
        parentId: simulation.folderId,
      });
      const { data: inputFolder } = await dispatch('HTTP_FOLDERS_CREATE', {
        name: 'input',
        parentType: 'folder',
        parentId: simulation.folderId,
      });
      simulation.metadata = Object.assign({}, simulation.metadata, {
        status: 'created',
        inputFolder: {
          _id: inputFolder._id,
          files: {},
        },
        outputFolder: {
          _id: outputFolder._id,
          files: {},
        },
      });
      const { data: updatedSimulation } = await dispatch(
        'HTTP_SIMULATIONS_UPDATE',
        simulation
      );

      if (attachments) {
        const promises = [];
        Object.keys(attachments).forEach((name) => {
          promises.push(
            dispatch('CONTAINER_CREATE_ITEM', {
              container: simulation,
              name,
              file: attachments[name],
              updateAction: 'HTTP_SIMULATIONS_UPDATE',
            })
          );
        });
        await Promise.all(promises);
      }
      commit('SIMULATION_SET', updatedSimulation);
      dispatch('ACTIVATE_SIMULATION', updatedSimulation);
      return updatedSimulation;
    },
    async SIMULATION_UPDATE({ commit, dispatch }, simulation) {
      const { data: updatedSimulation } = await dispatch(
        'HTTP_SIMULATIONS_UPDATE',
        simulation
      );
      commit('SIMULATION_SET', updatedSimulation);
      return updatedSimulation;
    },
    async SIMULATION_DELETE({ getters, commit, dispatch }, simulation) {
      const simulationsOfProject = getters.SIMULATIONS_BY_PROJECT_ID(
        simulation.projectId
      );
      const tasflowIds = [];
      Object.keys(simulation.steps).forEach((stepName) => {
        const { taskflowId } = simulation.steps[stepName].metadata || {};
        if (taskflowId) {
          tasflowIds.push(taskflowId);
        }
      });
      await dispatch('HTTP_SIMULATIONS_DELETE', simulation._id);
      while (tasflowIds.length) {
        dispatch('HTTP_TASKFLOWS_DELETE', { id: tasflowIds.pop() });
      }
      commit('PROJECT_SET_SIMULATIONS', {
        projectId: simulation.projectId,
        simulations: simulationsOfProject.filter(
          ({ _id }) => _id !== simulation._id
        ),
      });
      commit('SIMULATION_REMOVE', simulation);
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
        _id: id,
        active,
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
