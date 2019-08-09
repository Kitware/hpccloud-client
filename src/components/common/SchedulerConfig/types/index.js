import pbs from './PBS';
import sge from './SGE';
import slurm from './SLURM';

export const LABELS = {
  pbs: 'PBS',
  sge: 'Sun Grid Engine',
  slurm: 'SLURM',
};

export const COMPONENTS = {
  pbs,
  sge,
  slurm,
};

export const KEYS = Object.keys(COMPONENTS);

export default {
  LABELS,
  COMPONENTS,
  KEYS,
};
