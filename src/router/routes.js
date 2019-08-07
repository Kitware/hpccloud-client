import Home from 'hpccloud-client/src/views/Home.vue';
import ProjectList from 'hpccloud-client/src/views/Project/List';
import ProjectView from 'hpccloud-client/src/views/Project/View';
import SimulationView from 'hpccloud-client/src/views/Simulation/View';

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
    path: '/simulation/view/:id',
    name: 'simulationView',
    component: SimulationView,
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
