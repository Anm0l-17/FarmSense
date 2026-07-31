export function formatCurrency(value: number, perKg = true) {
  return `₹${value.toLocaleString("en-IN")}${perKg ? "/kg" : ""}`;
}

export function formatRange([a, b]: [number, number]) {
  return `₹${a.toLocaleString("en-IN")} – ₹${b.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string) {
  if (!iso) return "Just now";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Recently";
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 2) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24 && d.toDateString() === now.toDateString()) {
    return `Today, ${d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffDays === 1) {
    return `Yesterday, ${d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffDays > 1 && diffDays < 30) {
    return `${diffDays} days ago`;
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string) {
  if (!iso) return "Just now";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Recently";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}
