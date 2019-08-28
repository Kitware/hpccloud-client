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

// Application icons
Object.assign(girderVuetifyConfig.icons, {
  home: 'mdi-home',
  project: 'mdi-folder-outline',
  simulation: 'mdi-file-document-outline',
});

// Simput icons
Object.assign(girderVuetifyConfig.icons, {
  simput: {
    add: 'mdi-plus',
    warning: 'mdi-alert-outline',
    contentCopy: 'mdi-content-copy',
    delete: 'mdi-delete-outline',
    folder_open: 'mdi-folder-outline',
    close: 'mdi-close',
    error: 'mdi-bug',
    folder: 'mdi-folder',
    download: 'mdi-cloud-download',
    publish: 'mdi-publish',
    ok: 'mdi-check-circle-outline',
    check: 'mdi-check',
  },
});

// HPCCloud icons
Object.assign(girderVuetifyConfig.icons, {
  hpccloud: {
    editStep: 'mdi-circle-edit-outline',
    log: 'mdi-timeline-text-outline',
    jobs: 'mdi-format-list-bulleted-type',
    logs: 'mdi-message-text-outline',
    tasks: 'mdi-source-branch',
  },
});

// HPCCloud status icons
Object.assign(girderVuetifyConfig.icons, {
  status: {
    queued: 'mdi-database-settings',
    created: 'mdi-database-plus',
    pending: 'mdi-database-settings',
    running: 'mdi-database-refresh',
    completed: 'mdi-database-check',
    complete: 'mdi-database-check',
    terminating: 'mdi-database-export',
    terminated: 'mdi-database-remove',
  },
});

// Bind plugin
Vue.use(Vuetify, girderVuetifyConfig);
