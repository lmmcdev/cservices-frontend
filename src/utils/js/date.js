//export this function
export const toInputDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${m}-${day}-${dt.getFullYear()}`;
};

export const toDisplayDate = (d, locale='en-US') =>
  d ? new Date(d).toLocaleDateString(locale) : '';