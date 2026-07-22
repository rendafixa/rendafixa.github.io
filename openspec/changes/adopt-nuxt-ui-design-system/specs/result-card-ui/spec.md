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

## Tests

### Test file: `test/nuxt/InvestmentResult.test.ts` (new)

Mounts `app/components/InvestmentResult.vue` via `mountSuspended` with a representative set of props. The component currently receives: `name`, `totalAmount`, `liquidProfit`, `investedAmount`, `grossInterest`, `totalProfitPercentage`, `taxPercentage`, `taxAmount`, `iofAmount`.

Define a `defaultProps` fixture:
```ts
const defaultProps = {
  name: 'CDB / RDB',
  totalAmount: 1105.00,
  liquidProfit: 80.00,
  investedAmount: 1000.00,
  grossInterest: 100.00,
  totalProfitPercentage: 8,
  taxPercentage: 15,
  taxAmount: 15.00,
  iofAmount: null,
}
```

Covers:

#### Structural integrity (data-testid preservation)
- **`data-testid="result-card"` present** — `wrapper.find('[data-testid="result-card"]').exists()` is true; CalculatorPage integration tests depend on this
- **`data-testid="result-total-amount"` present** — element exists and its text contains `'R$'` and the formatted amount

#### Card content
- **Investment name renders** — `wrapper.text()` contains `'CDB / RDB'`
- **Invested amount renders** — `wrapper.text()` contains a formatted version of `1.000,00`
- **Liquid profit renders** — `wrapper.text()` contains the formatted profit

#### UProgress (profitability bar)
- **Progress bar is present** — `wrapper.find('progress').exists()` is true (UProgress renders a `<progress>` element) or the component contains a progress-role element
- **Progress value reflects profitability** — mount with `totalProfitPercentage: 40`; the `progress` element's `value` attribute (or aria-valuenow) is `'40'`
- **Progress value capped at 100** — mount with `totalProfitPercentage: 150`; the `progress` element's value is `'100'`, not `'150'`

#### UBadge (tax pill)
- **Badge present when tax applies** — with `taxPercentage: 15`; `wrapper.text()` contains `'15%'`
- **Badge absent when no tax** — mount with `taxPercentage: null`; no text matching `/%$/` in the tax position

#### Deductions section visibility
- **Hidden when no deductions** — mount with `taxAmount: null, iofAmount: null`; wrapper does not contain deductions text (no "IR" or "IOF" label)
- **IOF line renders when iofAmount > 0** — mount with `iofAmount: 5.00`; `wrapper.text()` contains `'IOF'`
- **Tax line renders when taxAmount > 0** — `wrapper.text()` contains `'IR'` (or the tax label used in the template)

### Test file: `test/nuxt/ContentGradientBox.test.ts` (update existing)

The existing test asserts on specific Tailwind class strings (`from-orange-`, `to-amber-`, `bg-linear-to-r`). After migration, this component should be simplified but still retain gradient utility classes. Update:

- **Keep slot content tests** — these are structural and remain valid
- **Loosen class assertions** — instead of asserting exact gradient class substrings, assert that the element has a `class` attribute containing `from-` and `to-` (gradient present regardless of specific color)
- **Keep `rounded-lg` and `p-4` assertions** — these represent the component's layout contract and should survive simplification

### CalculatorPage integration test: `test/nuxt/CalculatorPage.test.ts` (keep, verify still passes)

This test is the critical regression guard. It verifies result cards render via `data-testid="result-card"` and `data-testid="result-total-amount"`. No changes needed to the test itself — it must continue to pass after migration, confirming the testid attributes were preserved.
