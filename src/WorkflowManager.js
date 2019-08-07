let ICONS = {};
let SIMPUT_TYPE_LOADER = () => {};
const LISTENERS = [];

export const AVAILABLE_WORFLOW = {};
export const LOADED_WORKFLOW = [];

export function register(metadata) {
  AVAILABLE_WORFLOW[metadata.name] = metadata;

  // Register icon
  Object.assign(ICONS, {
    [metadata.name]: metadata.icon,
  });

  // Load simput type
  SIMPUT_TYPE_LOADER(metadata.simput.type, metadata.simput.urls);

  LISTENERS.forEach((fn) => fn());
}

export function onRegistration(fnCallback) {
  LISTENERS.push(fnCallback);
}

export function loadType(typeName) {
  return new Promise((resolve, reject) => {
    if (LOADED_WORKFLOW.indexOf(typeName) === -1) {
      LOADED_WORKFLOW.push(typeName);
      const newScriptTag = document.createElement('script');
      newScriptTag.type = 'text/javascript';
      newScriptTag.src = `workflows/${typeName}.umd.min.js`;
      newScriptTag.onload = resolve;
      newScriptTag.onerror = reject;
      document.body.appendChild(newScriptTag);
    } else {
      resolve();
    }
  });
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
