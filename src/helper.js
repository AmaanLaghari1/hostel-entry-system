export function convertUTCToLocalTime(utcTime) {
  const date = new Date(utcTime);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');

  return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}