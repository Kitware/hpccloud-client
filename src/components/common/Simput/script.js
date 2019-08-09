import { mapGetters } from 'vuex';

import WorkflowContent from 'simput/src/components/core/WorkflowContent';
import WorkflowMenu from 'simput/src/components/core/WorkflowMenu';

export default {
  name: 'hpcSimput',
  components: {
    WorkflowContent,
    WorkflowMenu,
  },
  props: {
    simulation: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    model: {
      type: Object,
      default: null,
    },
    step: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      mtime: 0,
      saveMTime: 0,
      unsubscribe: null,
    };
  },
  computed: {
    ...mapGetters({
      dataManager: 'SIMPUT_DATAMANAGER',
    }),
  },
  mounted() {
    this.updateSimputModel();
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  watch: {
    dataManager(manager) {
      const { unsubscribe } = manager.subscribe(() => {
        console.log('modelChanged');
        this.mtime++;
      });
      this.unsubscribe = unsubscribe;
    },
    model() {
      this.updateSimputModel();
    },
  },
  methods: {
    updateSimputModel() {
      const { type, model } = this;
      this.$store.dispatch('SIMPUT_CONFIGURE', { type, model });
    },
    cancel() {
      this.mtime = 0;
      this.saveMTime = 0;
      this.$store.dispatch('SIMULATION_FETCH', this.simulation._id);
    },
    save() {
      this.saveMTime = this.mtime;
      this.$store.dispatch('SIMULATION_UPDATE_STEP', {
        id: this.simulation._id,
        step: this.step,
        content: {
          metadata: {
            model: JSON.stringify(this.model),
          },
        },
      });
    },
  },
};
