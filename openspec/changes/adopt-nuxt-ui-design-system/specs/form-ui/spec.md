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
