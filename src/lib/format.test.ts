import { formatCurrency, formatNumber, formatRoas } from './format'

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
