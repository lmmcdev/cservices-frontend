/**
 * Normalizes a ticket date string from "MM/DD/YYYY" to "YYYY-MM-DD"
 * @param {*} datetimeString 
 * @returns 
 */
export function normalizeTicketDate(datetimeString) {
  if (!datetimeString || typeof datetimeString !== 'string') return null;
  const [datePart] = datetimeString.split('.');
  if (!datePart) return null;

  const [month, day, year] = datePart.split('/');
  if (!month || !day || !year) return null;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}