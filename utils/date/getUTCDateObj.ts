const now = new Date();

export function getUTCDateObj(date = now) {
  const [weekday, month, day, year, time, timezone] = date
    .toString()
    .split(' ');
  return {
    weekday,
    month,
    day,
    year,
    time,
    timezone,
    ...date,
  };
}
