/**
 * Format number ke Rupiah singkat (Rp 1.2B, Rp 150M, Rp 500K, Rp 50.000)
 */
export function formatRp(v: number): string {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `Rp ${Math.round(v / 1_000_000)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}
