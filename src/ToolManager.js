import { loadScript, loadCSS } from 'hpccloud-client/src/ScriptLoader';

export const AVAILABLE_TOOLS = {};

export function register(key, component) {
  AVAILABLE_TOOLS[key] = component;
}

export function loadTool(name) {
  loadCSS(`tools/${name}.css`);
  return loadScript(`tools/${name}.umd.min.js`);
}

window.HPCTools = {
  AVAILABLE_TOOLS,
  register,
};
