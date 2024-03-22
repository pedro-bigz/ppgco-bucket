export function insensitiveSplitString(str: string, needle: string | RegExp) {
  return str.split(new RegExp(needle, 'i'));
}
