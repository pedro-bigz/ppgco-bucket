export function isValidTime(time?: string | unknown): boolean {
  if (typeof time !== 'string' || time.length !== 5 || time[2] !== ':') {
    return false;
  }

  const [hour, minute] = time.split(':').map((timePiece) => Number(timePiece));

  return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
}
