export function removeNullAttributes(obj: { [key: string]: any }): {
  [key: string]: any;
} {
  const objWithoutNulls = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== ''),
  );

  return objWithoutNulls;
}
