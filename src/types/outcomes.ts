export type Kpis = {
  spend: number
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  roas: number
}

export type BreakdownRow = {
  channel: string
  spend: number
  conversions: number
  revenue: number
  roas: number
}

export type TimeseriesPoint = {
  date: string
  spend: number
  conversions: number
  revenue: number
}

export type OutcomesResponse = {
  kpis: Kpis
  timeseries: TimeseriesPoint[]
  breakdown: BreakdownRow[]
  rowCount: number
}

export type Meta = {
  channels: string[]
  campaigns: string[]
  audiences: string[]
  dateRange: { from: string; to: string }
}

export type Filters = {
  from?: string
  to?: string
  channel?: string
  campaign?: string
  audience?: string
}
