import { mapGetters } from 'vuex';

import { getRelativeTimeLabel } from 'hpccloud-client/src/utils/DateHelper';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

function projectToTable(project) {
  const { _id, type, name, updated, description } = project;
  return {
    id: _id,
    name,
    type,
    modified: updated,
    summary: description,
    actions: [],
  };
}

export default anonymousRedirect(
  {
    name: 'projects',
    computed: {
      ...mapGetters({
        projects: 'PROJECTS',
        icons: 'WF_MTIME',
      }),
      items() {
        return this.projects.map(projectToTable);
      },
    },
    methods: {
      getRelativeTimeLabel,
      view(e) {
        const { id } = e.target.dataset;
        this.$router.push(`/project/view/${id}`);
      },
      goTo(id, view) {
        this.$router.push(`/project/${view}/${id}`);
      },
    },
    watch: {
      icons() {
        this.modified++;
      },
    },
    data() {
      return {
        modified: 0,
        tableOptions: {
          descending: true,
          rowsPerPage: 25,
          sortBy: 'modified',
        },
        refreshCounter: 0,
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name',
          },
          {
            text: 'Modified',
            value: 'modified',
            align: 'center',
            sortable: true,
          },
          {
            text: 'Summary',
            value: 'summary',
            align: 'center',
            sortable: true,
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'right',
            sortable: false,
          },
        ],
      };
    },
  },
  '/'
);
