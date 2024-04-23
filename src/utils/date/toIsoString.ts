export function toIsoString(date?: unknown) {
  if (!date) return '';

  const newDate = String(date).split('/').reverse().join('-');

  return new Date(newDate).toISOString();
}
