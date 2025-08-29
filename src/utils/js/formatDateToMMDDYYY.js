/**
 * Formatea a "MM/DD/YYYY" y, si la cadena trae hora, añade " HH:MM".
 * Para Date/number, por defecto NO añade hora; usa { includeTimeForDate: true } para incluirla.
 */
export function toMMDDYYYY(input, { includeTimeForDate = false } = {}) {
  const pad = (n) => String(n).padStart(2, "0");
  if (input == null) return "";

  // --- STRINGS ---
  if (typeof input === "string") {
    const s = input.trim();

    // a) Solo fecha "YYYY-MM-DD" o "YYYY/MM/DD"
    let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (m) {
      const [, y, mo, da] = m;
      return `${pad(mo)}/${pad(da)}/${y}`;
    }

    // b) Fecha + hora "YYYY-MM-DDTHH:mm..." o "YYYY/MM/DD HH:mm..."
    m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[ T](\d{1,2}):(\d{2})/);
    if (m) {
      const [, y, mo, da, hh, mm] = m;
      return `${pad(mo)}/${pad(da)}/${y} ${pad(hh)}:${pad(mm)}`;
    }

    // c) No-ISO con T o espacio: "MM/DD/YYYYTHH:mm..." o "MM/DD/YYYY HH:mm..."
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T](\d{1,2}):(\d{2})/);
    if (m) {
      const [, mo, da, y, hh, mm] = m;
      return `${pad(mo)}/${pad(da)}/${y} ${pad(hh)}:${pad(mm)}`;
    }

    // d) Solo fecha "MM/DD/YYYY"
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const [, mo, da, y] = m;
      return `${pad(mo)}/${pad(da)}/${y}`;
    }
  }

  // --- Date o número (timestamp) ---
  const fromNumber = (n) => {
    // si parece seg (10 dígitos), convier­te a ms
    const ms = Math.abs(n) < 1e12 ? n * 1000 : n;
    return new Date(ms);
  };

  const d =
    input instanceof Date ? input :
    typeof input === "number" ? fromNumber(input) :
    typeof input === "string" ? new Date(input) :
    null;

  if (!d || isNaN(d.getTime())) return "";

  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const yyyy = d.getFullYear();

  if (!includeTimeForDate) {
    return `${mm}/${dd}/${yyyy}`;
  }

  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${mm}/${dd}/${yyyy} ${hh}:${mi}`;
}