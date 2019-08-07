import Vue from 'vue';
import Vuetify from 'vuetify';

import colors from 'vuetify/lib/util/colors';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';

import { vuetifyConfig as girderVuetifyConfig } from '@girder/components/src/utils';

Object.assign(girderVuetifyConfig.theme, {
  primary: colors.grey.darken1,
  secondary: colors.grey,
  accent: colors.grey.darken1,
  error: colors.red,
  info: colors.grey.lighten1,
});

Vue.use(Vuetify, girderVuetifyConfig);

// Application icons
Object.assign(girderVuetifyConfig.icons, {
  home: 'mdi-home',
  project: 'mdi-folder-outline',
  simulation: 'mdi-file-document-outline',
});

// worflow types
Object.assign(girderVuetifyConfig.icons, {
  Visualizer: 'mdi-cube-outline',
});
