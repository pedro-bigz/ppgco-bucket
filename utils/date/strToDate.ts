export function strToDate(dateString: string): string {
  const [year, month, day] = dateString
    .split('-')
    .map((str) => parseInt(str, 10));

  const dateObj = new Date(year, month - 1, day);

  return dateObj.toISOString().slice(0, 10);
}
