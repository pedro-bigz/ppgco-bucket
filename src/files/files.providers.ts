import { File } from './entities';
import { FILES_REPOSITORY } from './files.constants';

export const filesProviders = [
  {
    provide: FILES_REPOSITORY,
    useValue: File,
  },
];
