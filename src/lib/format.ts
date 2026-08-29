const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})
const number = new Intl.NumberFormat('en-AU')
const ratio = new Intl.NumberFormat('en-AU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currency.format(value)
}

export function formatNumber(value: number): string {
  return number.format(value)
}

export function formatRoas(value: number): string {
  return `${ratio.format(Number.isFinite(value) ? value : 0)}x`
}
