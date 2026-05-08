## ADDED Requirements

### Requirement: Investment input form fields use UFormField and UInput
Each of the 7 investment input components (`AmountInput`, `IndexCdbInput`, `IndexDiInput`, `IndexLcxInput`, `IndexSelicInput`, `PeriodInput`, `PeriodTypeInput`) SHALL replace their manual `<label>`, `<input>`, and error `<p>` markup with `<UFormField>` providing the label and error message, and `<UInput>` bound to the existing Pinia store computed property.

#### Scenario: Input renders a label
- **WHEN** any investment input component is rendered
- **THEN** a visible label associated with the input is present in the DOM

#### Scenario: Input shows validation error
- **WHEN** an invalid value is entered (e.g., amount ≤ 0)
- **THEN** `UFormField` renders the error message below the input field

#### Scenario: Input clears error on valid entry
- **WHEN** a previously invalid input receives a valid value
- **THEN** the error message disappears

### Requirement: Pinia store bindings are preserved unchanged
The computed `get`/`set` patterns in each input component that read from and write to the investment Pinia store SHALL remain functionally identical after migration. No store actions, getters, or state shape SHALL be modified.

#### Scenario: Amount updates the store on valid input
- **WHEN** the user types a positive number in the amount input
- **THEN** `store.amount` is updated to that value

#### Scenario: CDB rate updates the store
- **WHEN** the user enters a CDB percentage
- **THEN** `store.cdb` reflects the entered value

### Requirement: Leading icon is rendered inside UInput
Where an `<ion-icon>` was previously absolutely positioned inside the input container, the same icon SHALL be rendered using the `#leading` slot of `<UInput>`.

#### Scenario: Leading icon visible in amount input
- **WHEN** the amount input is rendered
- **THEN** a cash/money icon appears at the left side of the input field

#### Scenario: Leading icon visible in rate inputs
- **WHEN** a rate input (CDB, DI, SELIC, LCx) is rendered
- **THEN** a calculator icon appears at the left side of the input field

### Requirement: InvestmentInput container card uses UCard
The `InvestmentInput.vue` wrapper component (which contains the "Investimento" heading and form) SHALL use `<UCard>` instead of the manual `bg-white dark:bg-gray-800 rounded-lg shadow-md` container.

#### Scenario: Investment form is displayed inside a card
- **WHEN** the index page renders
- **THEN** the investment form is visually enclosed in a card with a title header and body section

## Tests

### Test file: `test/nuxt/AmountInput.test.ts` (update existing)

The existing test file targets raw DOM classes (`.text-red-600`, `input.border-red-500`) and specific `label[for="amount-input"]` selectors that will no longer be valid after migration to `UFormField` + `UInput`. Update to query by semantic meaning:

- **Label text** — find label by text content `'Valor da Aplicação'` (not by `for` attribute or tag alone), since UFormField renders a `<label>` that wraps the field name
- **Input is present** — find the underlying `<input>` element (UInput always renders one) and assert `type="number"` and `min="1"`
- **Currency suffix displays** — `wrapper.text()` contains `'R$'`
- **Ion-icon in leading slot** — `wrapper.find('ion-icon[name="cash-outline"]')` exists
- **Store binding (valid value)** — setValue a positive number; assert `store.amount` reflects it
- **Store binding (invalid value)** — setValue `0` or `-1`; assert `store.amount` is unchanged
- **Error message on invalid entry** — after setValue `0`, `wrapper.text()` contains an error string (not checked by CSS class)
- **Error cleared on valid entry** — after making input valid, no error text is present
- **Store reflection** — `store.setAmount(3000)` then `nextTick`; assert `<input>` value is `'3000'`

Remove all assertions on Tailwind class names (`.text-red-600`, `.border-red-500`) — these are implementation details of the old markup.

### Test file: `test/nuxt/IndexCdbInput.test.ts` (new)

Mounts `app/components/investment/IndexCdbInput.vue` via `mountSuspended`. Covers:

- **Label renders** — `wrapper.text()` contains `'CDB'` or the component's label text
- **Input is present** — `wrapper.find('input')` exists; `id` attribute is `'cdb-input'` (used by CalculatorPage tests)
- **Ion-icon in leading slot** — `wrapper.find('ion-icon')` exists
- **Valid value updates store** — setValue `110`; assert `store.cdb === 110`
- **Invalid value (≤ 0) rejected** — setValue `0`; store value unchanged; error text appears

### Test file: `test/nuxt/IndexDiInput.test.ts` (new)

Mounts `app/components/investment/IndexDiInput.vue`. Covers:

- **Label renders** — wrapper text contains the DI label
- **Input is present** — `wrapper.find('input')` exists
- **Ion-icon in leading slot** — present
- **Valid value updates store** — setValue a positive number; `store.di` reflects it
- **Invalid value rejected** — setValue `0`; store unchanged; error appears

### Test file: `test/nuxt/IndexLcxInput.test.ts` (new)

Mounts `app/components/investment/IndexLcxInput.vue`. Covers:

- **Label renders** — wrapper text contains the LCI/LCA label
- **Input present** — `id` attribute is `'lcx-input'` (used by CalculatorPage tests)
- **Ion-icon in leading slot** — present
- **Valid value updates store** — setValue `90`; `store.lcx === 90`
- **Invalid value rejected** — setValue `0`; store unchanged; error appears

### Test file: `test/nuxt/IndexSelicInput.test.ts` (new)

Mounts `app/components/investment/IndexSelicInput.vue`. Covers:

- **Label renders** — wrapper text contains the SELIC label
- **Input present** — `wrapper.find('input')` exists
- **Ion-icon in leading slot** — present
- **Valid value updates store** — setValue a positive number; `store.selic` reflects it
- **Invalid value rejected** — setValue `0`; store unchanged; error appears

### Test file: `test/nuxt/PeriodInput.test.ts` (new)

Mounts `app/components/investment/PeriodInput.vue`. Covers:

- **Label renders** — wrapper text contains the period label (e.g., "Prazo")
- **Input present** — `wrapper.find('input')` exists with `type="number"`
- **Ion-icon in leading slot** — present
- **Valid value updates store** — setValue `24`; `store.period === 24`
- **Invalid value (≤ 0) rejected** — setValue `0`; store unchanged; error appears

### Test file: `test/nuxt/PeriodTypeInput.test.ts` (new)

Mounts `app/components/investment/PeriodTypeInput.vue`. Covers:

- **Label or selector renders** — wrapper contains the period type selector (e.g., "Meses" / "Anos")
- **Toggle changes store** — selecting a different period type updates `store.periodType`
- **Currently selected value is reflected in the component**

### Test file: `test/nuxt/InvestmentInput.test.ts` (new)

Mounts `app/components/InvestmentInput.vue` via `mountSuspended`. Covers:

- **Card renders** — `wrapper.find('[data-testid="investment-input-card"]')` exists, OR confirm a UCard wraps the content (look for the heading "Investimento" inside the card)
- **Heading text** — `wrapper.text()` contains `'Investimento'`
- **All 7 input fields are present** — `wrapper.findAll('input')` returns at least 7 elements (or check by label text)
- **Period row layout** — `PeriodInput` and `PeriodTypeInput` are siblings in a flex row
