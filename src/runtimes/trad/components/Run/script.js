import { mapGetters } from 'vuex';

const NoFilter = () => true;

export default {
  name: 'hpcTraditionalRun',
  props: {
    clusterFilter: {
      type: Function,
      default: NoFilter,
    },
    getPayload: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      selectedProfile: null,
      schedulerData: {},
    };
  },
  mounted() {
    this.$store.dispatch('TRADITIONAL_FETCH_CLUSTERS');
  },
  computed: {
    ...mapGetters({
      clusters: 'TRADITIONAL_CLUSTERS',
      project: 'ACTIVE_PROJECT',
      simulation: 'ACTIVE_SIMULATION',
      workflow: 'ACTIVE_WORKFLOW',
    }),
    filteredProfiles() {
      return this.clusters
        .filter(this.clusterFilter)
        .map((cluster) => cluster.name);
    },
    activeProfile() {
      return this.clusters.find((p) => p.name === this.selectedProfile);
    },
    activeScheduler() {
      return this.activeProfile && this.activeProfile.config.scheduler.type;
    },
  },
  methods: {
    updateScheduler(schedulerInfo) {
      this.schedulerData = Object.assign({}, this.schedulerData, schedulerInfo);
    },
    submit() {
      const commonPayload = {};
      Object.assign(commonPayload, {
        cluster: { _id: this.activeProfile._id },
      });
      Object.assign(commonPayload, this.schedulerData[this.schedulerData.type]);
      if (this.getPayload) {
        const { project, simulation, workflow } = this;
        Object.assign(
          commonPayload,
          this.getPayload({ project, simulation, workflow })
        );
      }

      this.$emit('submit', commonPayload);
    },
  },
};
