import {
  AVAILABLE_WORFLOW,
  loadType,
  setIconsContainer,
} from 'hpccloud-client/src/WorkflowManager';

export default {
  state: {
    mtime: 0,
  },
  getters: {
    WF_GET(state) {
      state.mtime; // describe a dependency
      return (name) => AVAILABLE_WORFLOW[name];
    },
  },
  actions: {
    WF_UPDATED({ state }) {
      state.mtime++;
    },
    WF_ICONS_CONTAINER(ctx, container) {
      setIconsContainer(container);
    },
    async WF_LOAD({ dispatch }, name) {
      if (await loadType(name)) {
        console.log('wf updated');
        dispatch('WF_UPDATED');
      }
    },
  },
};
