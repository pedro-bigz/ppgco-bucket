export function lessUnderscore(data?: unknown) {
  return String(data).replace(/_/g, '');
}
