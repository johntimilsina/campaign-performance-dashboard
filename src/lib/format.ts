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
const compactCurrency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})
// en-GB, because en-AU spells June and July out in full and the axis ticks stop lining up
const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
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

export function formatCompactCurrency(value: number): string {
  return compactCurrency.format(value)
}

export function formatDayMonth(iso: string): string {
  return dayMonth.format(new Date(`${iso}T00:00:00Z`))
}
