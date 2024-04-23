import { dayjs } from 'src/core';
import { now } from 'lodash';

export function isValidPastDate(dateStr?: string | unknown, format?: string) {
  if (typeof dateStr !== 'string' || dateStr?.length < 10) {
    return false;
  }

  if (Number.isNaN(Number(dateStr))) {
    return false;
  }

  const dateFormat = format || 'DD/MM/YYYY';
  const date = dayjs(dateStr, dateFormat);

  return date.isValid() && date.isBefore(dayjs());
}
