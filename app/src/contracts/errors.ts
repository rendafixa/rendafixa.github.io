export type SimulationErrorCode
  = | 'invalid-principal'
    | 'invalid-rate'
    | 'invalid-maturity'
    | 'maturity-before-start'
    | 'maturity-outside-holiday-coverage'
    | 'unsupported-investment-type'
    | 'too-many-investments'
    | 'market-data-unavailable'
    | 'market-data-stale'
    | 'projection-unavailable'
    | 'invalid-share-payload'
    | 'unsupported-share-version'
    | 'share-payload-too-large'
    | 'calculation-overflow'
    | 'worker-unavailable'

export interface SimulationError {
  code: SimulationErrorCode
  message: string
  investmentId?: string
  field?: string
}

export interface SimulationWarning {
  code: SimulationErrorCode | 'fallback-current' | 'treasury-held-to-maturity' | 'fgc-limit'
  message: string
  investmentId?: string
}

export type DomainResult<T>
  = | { ok: true, value: T, warnings: SimulationWarning[] }
    | { ok: false, errors: SimulationError[] }
