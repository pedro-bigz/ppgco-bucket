import { Request } from 'express';

export const isAjax = (req: Request) => {
  return req.header('X-Requested-With') === 'XMLHttpRequest';
};
