import { AVAILABLE_TOOLS, loadTool } from 'hpccloud-client/src/ToolManager';

export default {
  state: {
    mtime: 0,
  },
  getters: {
    TOOLS_COMPONENT_BY_NAME(state) {
      state.mtime;
      return (name) => AVAILABLE_TOOLS[name];
    },
  },
  actions: {
    TOOLS_UPDATED({ state }) {
      state.mtime++;
    },
    async TOOLS_LOAD({ dispatch }, name) {
      if (await loadTool(name)) {
        console.log('tools updated');
        dispatch('TOOLS_UPDATED');
      }
    },
  },
};
