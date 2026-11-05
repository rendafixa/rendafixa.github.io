// The BCB calendar page has no documented machine-readable endpoint. These dates
// are the effective dates (the day after each meeting) from its published 2026
// and 2027 calendars. Focus projections beyond this range remain estimated.
export const PUBLISHED_COPOM_MEETINGS = [
  ['R1/2026', '2026-01-29'], ['R2/2026', '2026-03-19'], ['R3/2026', '2026-04-30'], ['R4/2026', '2026-06-18'],
  ['R5/2026', '2026-08-06'], ['R6/2026', '2026-09-17'], ['R7/2026', '2026-11-05'], ['R8/2026', '2026-12-10'],
  ['R1/2027', '2027-01-28'], ['R2/2027', '2027-03-18'], ['R3/2027', '2027-04-29'], ['R4/2027', '2027-06-17'],
  ['R5/2027', '2027-08-05'], ['R6/2027', '2027-09-23'], ['R7/2027', '2027-10-28'], ['R8/2027', '2027-12-09'],
].map(([meeting, effectiveDate]) => ({ meeting, effectiveDate }))

export async function fetchCopom() {
  return PUBLISHED_COPOM_MEETINGS
}
