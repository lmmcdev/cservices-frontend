export function toMMDDYYYY(input) {
  const pad = (n) => String(n).padStart(2, "0");

  // 1) Strings tipo "YYYY-MM-DD" o "YYYY/MM/DD" → evita problemas de zona horaria
  if (typeof input === "string") {
    const m = input.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (m) {
      const [, y, mo, da] = m;
      return `${pad(mo)}/${pad(da)}/${y}`;
    }
  }

  // 2) Date o valores parseables por Date (timestamp/ISO/etc.)
  const d =
    input instanceof Date ? input :
    typeof input === "number" ? new Date(input) :
    typeof input === "string" ? new Date(input) :
    null;

  if (!d || isNaN(d.getTime())) return "";

  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// --- Ejemplos ---
//toMMDDYYYY(new Date(2025, 0, 5));       // "01/05/2025"  (mes 0 = enero)
//toMMDDYYYY("2025-08-19");               // "08/19/2025"
//toMMDDYYYY("2025/8/3");                 // "08/03/2025"
//toMMDDYYYY(1735603200000);              // desde timestamp -> "12/31/2024"
//toMMDDYYYY("texto invalido");           // ""
