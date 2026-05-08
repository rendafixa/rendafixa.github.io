## ADDED Requirements

### Requirement: InvestmentResult uses UCard as the root container
`InvestmentResult.vue` SHALL use `<UCard>` as its root element instead of the manual `rounded-xl shadow-lg overflow-hidden border` div. The card's header slot SHALL contain the investment name with the color gradient background.

#### Scenario: Result card renders with testid attribute
- **WHEN** an investment result is rendered
- **THEN** the element with `data-testid="result-card"` is present in the DOM

#### Scenario: Result card renders the investment name in the header
- **WHEN** the `name` prop is provided (e.g., "Poupança")
- **THEN** the investment name appears in the card header area

### Requirement: Profitability bar uses UProgress
The horizontal profitability progress bar in `InvestmentResult.vue` SHALL be implemented using `<UProgress>` instead of the manual nested `div` approach. The progress value SHALL be capped at 100.

#### Scenario: Progress bar reflects profitability
- **WHEN** an investment result has a total profit percentage of 15%
- **THEN** the UProgress bar is at 15% fill

#### Scenario: Progress bar caps at 100%
- **WHEN** the total profit percentage exceeds 100%
- **THEN** the UProgress bar displays at 100% fill without overflow

### Requirement: Tax rate percentage uses UBadge
The tax percentage pill (currently a `<span>` with manual `rounded-full` and color classes) SHALL be replaced with `<UBadge>` with an appropriate color variant.

#### Scenario: Tax badge is visible when tax applies
- **WHEN** the `taxPercentage` prop is non-null and greater than zero
- **THEN** a UBadge showing the percentage is rendered inside the deductions section

#### Scenario: Tax badge is absent when no tax applies
- **WHEN** the `taxPercentage` prop is null or zero
- **THEN** no badge element is rendered in the deductions section

### Requirement: All result data fields render correctly after migration
The total net amount, liquid profit, invested amount, gross interest, tax amount, and IOF amount SHALL all be displayed with the same formatting and visibility conditions as before migration.

#### Scenario: Total amount is displayed with testid
- **WHEN** an investment result is rendered
- **THEN** the element with `data-testid="result-total-amount"` contains the formatted total amount in BRL currency

#### Scenario: Deductions section is hidden when there are no deductions
- **WHEN** `taxAmount` and `iofAmount` are both null or zero
- **THEN** the deductions section is not rendered

#### Scenario: Deductions section shows IOF when applicable
- **WHEN** `iofAmount` is greater than zero
- **THEN** the IOF line item appears in the deductions section with a negative formatted value
