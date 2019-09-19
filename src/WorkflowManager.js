import { loadScript } from 'hpccloud-client/src/ScriptLoader';

let ICONS = {};
let SIMPUT_TYPE_LOADER = () => {};
const LISTENERS = [];

export const AVAILABLE_WORFLOW = {};

export function register(metadata) {
  console.log('==> Register Workflow', metadata.name);
  AVAILABLE_WORFLOW[metadata.name] = metadata;

  // Register icon
  Object.assign(ICONS, {
    [metadata.name]: metadata.icon,
  });

  // Load simput type
  if (metadata.simput) {
    SIMPUT_TYPE_LOADER(metadata.simput.type, metadata.simput.urls);
  }

  LISTENERS.forEach((fn) => fn());
}

export function onRegistration(fnCallback) {
  LISTENERS.push(fnCallback);
}

export function loadType(typeName) {
  return loadScript(`workflows/${typeName}.umd.min.js`);
}

export function setIconsContainer(container) {
  ICONS = container;
  Object.keys(AVAILABLE_WORFLOW).forEach((name) => {
    ICONS[name] = AVAILABLE_WORFLOW[name].icon;
  });
}

export function setSimputTypeLoader(fn) {
  SIMPUT_TYPE_LOADER = fn;
}

window.HPCWorkflow = {
  AVAILABLE_WORFLOW,
  register,
  setSimputTypeLoader,
};
