import { mapGetters } from 'vuex';

import { getRelativeTimeLabel } from 'hpccloud-client/src/utils/DateHelper';
import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';

function simulationToTable(simulation) {
  if (!simulation) {
    return null;
  }
  const { _id, name, updated, description } = simulation;
  return {
    id: _id,
    name,
    modified: updated,
    summary: description,
    actions: [],
  };
}

export default anonymousRedirect(
  {
    name: 'project.view',
    computed: {
      ...mapGetters({
        projectId: 'ACTIVE_PROJECT_ID',
        projectById: 'PROJECT_BY_ID',
        simulationsByProjectId: 'SIMULATIONS_BY_PROJECT_ID',
        wfGetter: 'WF_GET',
      }),
      project() {
        return this.projectById(this.$route.params.id);
      },
      simulations() {
        return this.simulationsByProjectId(this.$route.params.id);
      },
      items() {
        return this.simulations.map(simulationToTable);
      },
      wf() {
        return this.wfGetter(this.project.type);
      },
    },
    methods: {
      getRelativeTimeLabel,
      view(e) {
        const { id } = e.target.dataset;
        this.$router.push(`/simulation/view/${id}`);
      },
      goTo(id, view) {
        this.$router.push(`/simulation/${view}/${id}`);
      },
    },
    data() {
      return {
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
