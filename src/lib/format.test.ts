import {
  formatCompactCurrency,
  formatCurrency,
  formatDayMonth,
  formatNumber,
  formatRoas,
} from './format'

describe('formatRoas', () => {
  it('formats a ratio to two places with an x suffix', () => {
    expect(formatRoas(3.456)).toBe('3.46x')
  })

  it('formats zero without producing NaN or Infinity', () => {
    expect(formatRoas(0)).toBe('0.00x')
  })

  it('falls back to zero when the ratio is not finite', () => {
    expect(formatRoas(Infinity)).toBe('0.00x')
    expect(formatRoas(NaN)).toBe('0.00x')
  })
})

describe('formatCurrency', () => {
  it('formats without cents', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235')
  })

  it('groups thousands', () => {
    expect(formatCurrency(609486.32)).toBe('$609,486')
  })
})

describe('formatNumber', () => {
  it('groups thousands', () => {
    expect(formatNumber(15057884)).toBe('15,057,884')
  })
})

describe('formatCompactCurrency', () => {
  it('shortens large values so they fit an axis', () => {
    expect(formatCompactCurrency(80287.55)).toBe('$80.3K')
    expect(formatCompactCurrency(1229078.14)).toBe('$1.2M')
  })

  it('drops the decimal when there is nothing to show', () => {
    expect(formatCompactCurrency(0)).toBe('$0')
    expect(formatCompactCurrency(950)).toBe('$950')
  })
})

describe('formatDayMonth', () => {
  it('shortens an iso date for an axis tick', () => {
    expect(formatDayMonth('2026-03-01')).toBe('1 Mar')
  })

  it('abbreviates every month to three letters, including june and july', () => {
    expect(formatDayMonth('2026-06-15')).toBe('15 Jun')
    expect(formatDayMonth('2026-07-30')).toBe('30 Jul')
  })

  it('reads the date as utc, so the day never slips by one', () => {
    expect(formatDayMonth('2026-02-01')).toBe('1 Feb')
  })
})
