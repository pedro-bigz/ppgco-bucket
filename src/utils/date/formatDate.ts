export function formatToISODate(data: string): string {
  const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regexData.test(data)) return data;

  const [day, month, year]: string[] = data.split('/');

  return `${year}-${month}-${day}`;
}
