// UTC time to local time conversion
export function convertUTCToLocalTime(utcTime) {
  const localTime = new Date(utcTime);
  return localTime.toLocaleString();
}