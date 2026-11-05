import type { IsoDate } from './investment'

export interface CurrentRate {
  annualPct: string
  referenceDate: IsoDate
}

export interface SelicProjectionPoint {
  meeting: string
  effectiveDate: IsoDate
  annualPct: string
  estimated: boolean
}

export interface IpcaProjectionYear {
  year: number
  annualPct: string
}

export interface Holiday {
  date: IsoDate
  name: string
}

export interface SourceMetadata {
  url: string
  retrievedAt: string
  referenceDate: IsoDate
  status: 'fresh' | 'stale'
  lastSuccessfulAt: string
}

export interface MarketSnapshot {
  schemaVersion: 1
  generatedAt: string
  brazilReferenceDate: IsoDate
  rates: {
    selicEffective: CurrentRate
    selicTarget: CurrentRate
    cdi: CurrentRate
    ipca12m: CurrentRate
    trMonthly: CurrentRate
  }
  projections: {
    selic: SelicProjectionPoint[]
    ipca: IpcaProjectionYear[]
  }
  holidays: {
    supportedFrom: IsoDate
    supportedUntil: IsoDate
    dates: Holiday[]
  }
  sources: Record<string, SourceMetadata>
}
