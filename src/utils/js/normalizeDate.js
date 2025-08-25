/**
 * Normalizes a ticket date string from "MM/DD/YYYY" to "YYYY-MM-DD"
 * @param {*} datetimeString 
 * @returns 
 */
export function normalizeTicketDate(value) {
  try {
    if (value == null) return null;

    // Date object
    if (value instanceof Date && !isNaN(value)) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const d = String(value.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    // Timestamp (ms)
    if (typeof value === 'number' && Number.isFinite(value)) {
      const d = new Date(value);
      if (isNaN(d)) return null;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    // String
    if (typeof value !== 'string') return null;
    const s = value.trim();
    if (!s) return null;

    // 1) ISO-like: YYYY-MM-DD o YYYY-MM-DDTHH...
    //    (tomamos solo la parte de fecha, sin parsear zona horaria)
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
    if (isoMatch) {
      const [, Y, M, D] = isoMatch;
      return `${Y}-${M}-${D}`;
    }

    // 2) US: MM/DD/YYYY (opcionalmente con hora después)
    const usMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:.*)?$/);
    if (usMatch) {
      let [, m, d, y] = usMatch;
      m = m.padStart(2, '0');
      d = d.padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    // 3) Fallback: intentar parsear con Date (local time)
    const d = new Date(s);
    if (!isNaN(d)) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    return null;
  } catch {
    return null;
  }
}
