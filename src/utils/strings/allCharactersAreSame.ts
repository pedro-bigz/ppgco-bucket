export function allCharactersAreSame(str: string): boolean {
  return /^(\w)\1*$/.test(str);
}
