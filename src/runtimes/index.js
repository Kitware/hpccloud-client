import RunTrad from 'hpccloud-client/src/runtimes/trad/components/Run';
import NoContent from 'hpccloud-client/src/components/common/NoContent';

export default {
  trad: {
    icon: 'mdi-server-network',
    component: RunTrad,
  },
  ec2: {
    icon: 'mdi-aws',
    component: NoContent,
  },
  gCloud: {
    icon: 'mdi-google',
    component: NoContent,
  },
};
