import { AVAILABLE_TOOLS, loadTool } from 'hpccloud-client/src/ToolManager';

export default {
  state: {
    mtime: 0,
    listing: [],
  },
  getters: {
    TOOLS_COMPONENT_BY_NAME(state) {
      state.mtime;
      return (name) => AVAILABLE_TOOLS[name];
    },
    TOOLS_LISTING(state) {
      return state.listing;
    },
  },
  actions: {
    async TOOLS_FETCH_AVAILABLE({ state }) {
      if (state.listing.length) {
        return state.listing;
      }
      const response = await fetch('/tools/index.json');
      const content = await response.json();
      state.listing = content;
      return content;
    },
    TOOLS_UPDATED({ state }) {
      state.mtime++;
    },
    async TOOLS_LOAD({ dispatch }, name) {
      if (await loadTool(name)) {
        dispatch('TOOLS_UPDATED');
        console.log('==> Register Tool', name);
      }
    },
    TOOLS_LOAD_ALL({ dispatch }) {
      dispatch('TOOLS_FETCH_AVAILABLE').then((list) => {
        list.forEach(({ value }) => dispatch('TOOLS_LOAD', value));
      });
    },
  },
};
