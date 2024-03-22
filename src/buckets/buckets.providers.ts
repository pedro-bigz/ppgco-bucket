import { Bucket } from './entities';
import { BUCKETS_REPOSITORY } from './buckets.constants';

export const bucketsProviders = [
  {
    provide: BUCKETS_REPOSITORY,
    useValue: Bucket,
  },
];
