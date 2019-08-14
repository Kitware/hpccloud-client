import JobScheduling from 'hpccloud-client/src/components/common/JobScheduling';
import NextStepButton from 'hpccloud-client/src/components/common/NextStepButton';
import NoContent from 'hpccloud-client/src/components/common/NoContent';
import SchedulerConfig from 'hpccloud-client/src/components/common/SchedulerConfig';
import Simput from 'hpccloud-client/src/components/common/Simput';

function install(Vue) {
  Vue.component('hpc-job-scheduling', JobScheduling);
  Vue.component('hpc-next-step-button', NextStepButton);
  Vue.component('hpc-no-content', NoContent);
  Vue.component('hpc-scheduler-config', SchedulerConfig);
  Vue.component('hpc-simput', Simput);
}

export default {
  install,
};
