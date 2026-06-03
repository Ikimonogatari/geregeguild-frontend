/** Charter prices — placeholder figures until the backend is wired. */
export function formatPrice(usd: number): string {
  return `$${usd.toLocaleString("en-US")}`;
}

export function formatPriceRange(from: number, to: number): string {
  if (from === 0 && to === 0) return "By design";
  return `${formatPrice(from)} – ${formatPrice(to)}`;
}
