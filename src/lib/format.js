export function telHref(number = "") {
  const d = number.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return `tel:${d}`;
  if (d.startsWith("0")) return `tel:+60${d.slice(1)}`;
  return `tel:${d}`;
}

export const waHref = (number = "") => `https://wa.me/${number.replace(/\D/g, "")}`;

export function slugify(text = "") {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });
}

export const lines = (text = "") => text.split("\n").map((l) => l.trim()).filter(Boolean);
export const paragraphs = (text = "") => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
export const readTime = (text = "") => `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} min`;
