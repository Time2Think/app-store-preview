export function formatReviews(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatRating(r: number): string {
  const clamped = Math.min(5, Math.max(0, r))
  return clamped.toFixed(1)
}

export function formatPrice(price: string): string {
  if (!price) return 'Free'
  return `$${price}`
}
