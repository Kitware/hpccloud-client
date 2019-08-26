import JobMonitoring from 'hpccloud-client/src/components/common/JobMonitoring';
import JobScheduling from 'hpccloud-client/src/components/common/JobScheduling';
import LogEntry from 'hpccloud-client/src/components/common/LogEntry';
import NextStepButton from 'hpccloud-client/src/components/common/NextStepButton';
import NoContent from 'hpccloud-client/src/components/common/NoContent';
import SchedulerConfig from 'hpccloud-client/src/components/common/SchedulerConfig';
import Simput from 'hpccloud-client/src/components/common/Simput';
import StatusSummary from 'hpccloud-client/src/components/common/StatusSummary';

function install(Vue) {
  Vue.component('hpc-job-monitoring', JobMonitoring);
  Vue.component('hpc-job-scheduling', JobScheduling);
  Vue.component('hpc-log-entry', LogEntry);
  Vue.component('hpc-next-step-button', NextStepButton);
  Vue.component('hpc-no-content', NoContent);
  Vue.component('hpc-scheduler-config', SchedulerConfig);
  Vue.component('hpc-simput', Simput);
  Vue.component('hpc-status-summary', StatusSummary);
}

export default {
  install,
};
