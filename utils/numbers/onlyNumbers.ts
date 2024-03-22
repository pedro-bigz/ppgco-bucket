export function onlyNumbers(data?: string) {
  return data?.replace(/[^0-9]/g, '') || '';
}
