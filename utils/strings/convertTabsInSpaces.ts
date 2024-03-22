const space = String.fromCharCode(0x20);
export const convertTabsInSpaces = (text: string) => {
  return text.replace('\t', space + space);
};
