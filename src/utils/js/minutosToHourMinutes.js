// src/utils/timeUtils.js

/**
 * Convierte minutos a un string en formato "Xh Ym"
 * Si recibe string o null, lo convierte a número de forma segura.
 * Si no es número válido, devuelve "0m".
 */
export function formatMinutesToHoursPretty(minutes) {
  const totalMinutes = Number(minutes);

  if (isNaN(totalMinutes) || totalMinutes < 0) {
    return '0m';
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (mins > 0 || hours === 0) {
    parts.push(`${mins}m`);
  }

  return parts.join(' ');
}

/**
 * Convierte una hora (0-23) a formato AM/PM legible.
 * Ej: 17 => "5 PM"
 */
export function formatHour(hour) {
  const h = Number(hour);
  if (isNaN(h) || h < 0 || h > 23) return '';

  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${period}`;
}

/**
 * Devuelve un rango legible para un bloque horario.
 * Ej: 17 => "5 PM - 6 PM"
 */
export function formatHourRange(startHour) {
  const start = Number(startHour);
  if (isNaN(start) || start < 0 || start > 23) return '';

  const end = (start + 1) % 24;
  return `${formatHour(start)} - ${formatHour(end)}`;
}
