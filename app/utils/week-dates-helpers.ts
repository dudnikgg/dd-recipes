const today = new Date();
const monday = new Date(today);
const offset = (today.getDay() + 6) % 7; // makes Monday=0, Tuesday=1… Sunday=6
monday.setDate(today.getDate() - offset);

export function getWeekDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export function isPast(d: Date) {
  const a = new Date(d);
  a.setHours(0, 0, 0, 0);
  const b = new Date(today);
  b.setHours(0, 0, 0, 0);
  return a < b;
}
