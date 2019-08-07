import {
  AVAILABLE_WORFLOW,
  loadType,
  setIconsContainer,
} from 'hpccloud-client/src/WorkflowManager';

export default {
  state: {
    vuetify: null,
    loadedCount: 0,
    listener: false,
  },
  getters: {
    WF_GET(state) {
      state.loadedCount; // describe a dependency
      return (name) => AVAILABLE_WORFLOW[name];
    },
    WF_COUNT(state) {
      return state.loadedCount;
    },
  },
  actions: {
    WF_ICONS_CONTAINER(ctx, container) {
      setIconsContainer(container);
    },
    WF_LOAD({ dispatch }, name) {
      loadType(name).then(() => {
        dispatch('WF_UPDATE_COUNT');
      });
    },
    WF_UPDATE_COUNT({ state }) {
      state.loadedCount = Object.keys(AVAILABLE_WORFLOW).length;
    },
  },
};
