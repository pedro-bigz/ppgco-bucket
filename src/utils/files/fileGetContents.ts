import fs from 'fs';

export const fileGetContents = (filename: string) => {
  return fs.readFileSync(filename).toString();
};
