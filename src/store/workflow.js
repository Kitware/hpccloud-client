import {
  AVAILABLE_WORFLOW,
  loadType,
  setIconsContainer,
} from 'hpccloud-client/src/WorkflowManager';

export default {
  state: {
    mtime: 0,
    listing: [],
  },
  getters: {
    WF_GET(state) {
      state.mtime; // describe a dependency
      return (name) => AVAILABLE_WORFLOW[name];
    },
    WF_LISTING(state) {
      return state.listing;
    },
    WF_MTIME(state) {
      return state.mtime;
    },
  },
  actions: {
    async WF_FETCH_AVAILABLE({ state }) {
      if (state.listing.length) {
        return state.listing;
      }
      const response = await fetch('/workflows/index.json');
      const content = await response.json();
      state.listing = content;

      return content;
    },
    WF_UPDATED({ state }) {
      state.mtime++;
    },
    WF_ICONS_CONTAINER(ctx, container) {
      setIconsContainer(container);
    },
    async WF_LOAD({ dispatch }, name) {
      if (await loadType(name)) {
        dispatch('WF_UPDATED');
      }
    },
    WF_LOAD_ALL({ dispatch }) {
      dispatch('WF_FETCH_AVAILABLE').then((list) => {
        list.forEach(({ value }) => dispatch('WF_LOAD', value));
      });
    },
  },
};
