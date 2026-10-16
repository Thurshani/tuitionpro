export function text(v, min = 1, max = 150) {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}
export function id(v) {
  return Number.isSafeInteger(Number(v)) && Number(v) > 0;
}
export function month(v) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(v);
}
export function date(v) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    !Number.isNaN(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v
  );
}
export function email(v) {
  return text(v, 3, 190) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
