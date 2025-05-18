export function getPort(defaultValue?: number | string) {
  return +(process.env.PORT || defaultValue);
}
