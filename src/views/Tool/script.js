import { mapGetters } from 'vuex';

import { anonymousRedirect } from 'hpccloud-client/src/utils/RedirectHelper';
import NoContent from 'hpccloud-client/src/components/common/NoContent';

export default anonymousRedirect(
  {
    name: 'tool',
    computed: {
      ...mapGetters({
        simulation: 'ACTIVE_SIMULATION',
        getComponentByName: 'TOOLS_COMPONENT_BY_NAME',
      }),
      toolName() {
        return this.$route.path.split('/')[2];
      },
      component() {
        if (!this.simulation) {
          return NoContent;
        }

        return this.getComponentByName(this.toolName) || NoContent;
      },
    },
  },
  '/'
);
