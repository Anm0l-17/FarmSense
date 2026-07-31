export function formatCurrency(value: number, perKg = true) {
  return `₹${value.toLocaleString("en-IN")}${perKg ? "/kg" : ""}`;
}

export function formatRange([a, b]: [number, number]) {
  return `₹${a.toLocaleString("en-IN")} – ₹${b.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  const days = Math.round((today.getTime() - d.getTime()) / 864e5);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 6e4);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  return `${Math.round(hrs / 24)} days ago`;
}
