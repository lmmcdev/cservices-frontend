export function formatPhone(value = '') {
  const digits = (value || '').replace(/\D/g, '').slice(-10);
  const parts = [];
  if (digits.length > 0) parts.push('(' + digits.slice(0, 3));
  if (digits.length >= 4) parts[0] += ') ';
  if (digits.length >= 4) parts.push(digits.slice(3, 6));
  if (digits.length >= 7) parts.push('-' + digits.slice(6, 10));
  return digits ? '+1 ' + parts.join('') : 'N/A';
}
