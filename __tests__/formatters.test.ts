import { describe, it, expect } from 'vitest'
import { formatReviews, formatRating, formatPrice } from '../lib/formatters'

describe('formatReviews', () => {
  it('formats numbers under 1000 as-is', () => {
    expect(formatReviews(999)).toBe('999')
  })
  it('formats 1000 as 1K', () => {
    expect(formatReviews(1000)).toBe('1K')
  })
  it('formats 12000 as 12K', () => {
    expect(formatReviews(12000)).toBe('12K')
  })
  it('formats 1500 as 1.5K', () => {
    expect(formatReviews(1500)).toBe('1.5K')
  })
  it('formats 1000000 as 1M', () => {
    expect(formatReviews(1000000)).toBe('1M')
  })
})

describe('formatRating', () => {
  it('rounds to 1 decimal', () => {
    expect(formatRating(4.567)).toBe('4.6')
  })
  it('clamps to 5.0 max', () => {
    expect(formatRating(6)).toBe('5.0')
  })
  it('clamps to 0 min', () => {
    expect(formatRating(-1)).toBe('0.0')
  })
})

describe('formatPrice', () => {
  it('returns "Free" for empty string', () => {
    expect(formatPrice('')).toBe('Free')
  })
  it('returns "$0.99" for "0.99"', () => {
    expect(formatPrice('0.99')).toBe('$0.99')
  })
})
