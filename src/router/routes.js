import Home from 'hpccloud-client/src/views/Home.vue';
import ProjectEdit from 'hpccloud-client/src/views/Project/Edit';
import ProjectList from 'hpccloud-client/src/views/Project/List';
import ProjectNew from 'hpccloud-client/src/views/Project/New';
import ProjectView from 'hpccloud-client/src/views/Project/View';
import SimulationEdit from 'hpccloud-client/src/views/Simulation/Edit';
import SimulationNew from 'hpccloud-client/src/views/Simulation/New';
import SimulationView from 'hpccloud-client/src/views/Simulation/View';
import ToolView from 'hpccloud-client/src/views/Tool';

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/projects',
    name: 'projectList',
    component: ProjectList,
  },
  {
    path: '/project/view/:id',
    name: 'projectView',
    component: ProjectView,
  },
  {
    path: '/project/edit/:id',
    name: 'projectEdit',
    component: ProjectEdit,
  },
  {
    path: '/project/new/',
    name: 'projectNew',
    component: ProjectNew,
  },
  {
    path: '/simulation/new/:id',
    name: 'simulationNew',
    component: SimulationNew,
  },
  {
    path: '/simulation/edit/:id',
    name: 'simulationEdit',
    component: SimulationEdit,
  },
  {
    path: '/simulation/view/:id/:view?',
    name: 'simulationView',
    component: SimulationView,
  },
  {
    path: '/tool/:toolName/:id/',
    name: 'toolView',
    component: ToolView,
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ 'hpccloud-client/src/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () =>
      import(/* webpackChunkName: "register" */ 'hpccloud-client/src/views/Register.vue'),
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: () =>
      import(/* webpackChunkName: "resetPassword" */ 'hpccloud-client/src/views/ResetPassword.vue'),
  },
];
