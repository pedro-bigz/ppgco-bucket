export function strContains(
  str: string,
  needle: string,
  caseSensitive: boolean = true,
) {
  const mode = caseSensitive ? '' : 'i';
  const regex = new RegExp(str, mode);

  return regex.test(needle);
}
