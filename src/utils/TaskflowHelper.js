export const STATUS_COMPLETE = ({ status }) => status === 'complete';
export const STATUS_TERMINATED = ({ status }) => status === 'terminated';
export const STATUS_TERMINATING = ({ status }) => status === 'terminating';
export const STATUS_ERROR = ({ status }) => status === 'error';
export const STATUS_RUNNING = ({ status }) => status === 'running';

export function getTaskflowStatus(taskflow) {
  if (!taskflow) {
    return null;
  }
  const jobs = Object.keys(taskflow.jobMapById || {}).map(
    (id) => taskflow.jobMapById[id]
  );
  const tasks = Object.keys(taskflow.taskMapById || {}).map(
    (id) => taskflow.taskMapById[id]
  );

  const allComplete =
    jobs.every(STATUS_COMPLETE) && tasks.every(STATUS_COMPLETE);

  if (allComplete) {
    return 'complete';
  }

  if (
    (jobs.length && jobs.every(STATUS_TERMINATED)) ||
    (tasks.some(STATUS_ERROR) &&
      (jobs.length === 0 || !jobs.some(STATUS_RUNNING)))
  ) {
    return 'terminated';
  }

  if (
    !allComplete &&
    jobs.length + tasks.length &&
    !jobs.some(STATUS_TERMINATING)
  ) {
    return 'running';
  }

  return null;
}

export default {
  getTaskflowStatus,
};
