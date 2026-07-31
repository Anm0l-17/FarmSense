export function formatCurrency(value: number, perKg = true) {
  return `₹${value.toLocaleString("en-IN")}${perKg ? "/kg" : ""}`;
}

export function formatRange([a, b]: [number, number]) {
  return `₹${a.toLocaleString("en-IN")} – ₹${b.toLocaleString("en-IN")}`;
}

export function parseDate(iso: string): Date {
  if (!iso) return new Date();
  let str = String(iso).trim();
  // If string is naive ISO without timezone offset (e.g. 2026-07-31T07:13:00), append 'Z' for UTC
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(str)) {
    str += "Z";
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function formatDate(iso: string): string {
  if (!iso) return "Just now";
  const d = parseDate(iso);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - d.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 2) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string): string {
  return formatDate(iso);
}
