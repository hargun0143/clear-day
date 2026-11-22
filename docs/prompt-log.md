# Prompt Log: Plan Generation

## v3 (Current) — `api/_lib/plan/prompts/plan-prompt.ts`

### Problems observed in v2 output

1. **Equipment inversions and hallucinations:** Users without an air purifier were told to "Activate your purifier", while purifier owners received advice to purchase one.
2. **Identical, generic sections:** Indoor Air offered smoking tips to non-smokers; Low-Emission Swaps advised public transport to people already taking buses/metro and walking to walkers.
3. **Cross-section topic duplication:** Home-setup tips (wet mopping, sealing windows) were repeatedly injected into daily time slots despite belonging to Indoor Air.
4. **Clinical and medicalized phrasing:** Clinical terms like "vulnerable home", blunt statements on smoking, and physiological lines like "keep breathing steady".

### Changes made

1. **Flag verification and exhaust support:** Added `hasExhaust` to `FactSheet` and fixed home-setup parsing in `buildFactSheet` to properly respect exclusive `none` selections across strings and arrays. Added dev-only server flag logging.
2. **Deterministic code-level topic selection (`api/_lib/plan/topics/`):**
   - `select-indoor-topics.ts`: Pure selection based on AQI (windows-closed at ≥101), smoking status, kitchen exhaust/biomass, purifier ownership, DIY filter eligibility, and AC recirculation. Capped at 5 topics.
   - `select-swaps.ts`: Excludes swaps the person already does (walking/cycling, transit, or mostly indoors), restricts idling advice to motorists, includes cleaner fuel for biomass cooking, keeps open burning prohibition. Capped at 3 swaps (empty for minors).
   - `select-good-habits.ts`: Identifies up to 3 positive actions already in practice (walking/transit, air purification, kitchen exhaust, smoke-free home, indoor shelter).
3. **Strict prompt boundaries:**
   - Gemini only rewrites selected topics and is explicitly forbidden from injecting unselected topics or mentioning unowned equipment.
   - Daily plan is restricted to schedule, routine, and timing by time of day; cleaning and home-setup topics are strictly forbidden in daily slots.
   - Prohibited "vulnerable home" phrasing; household members must be described by label. Indoor smoking must be phrased neutrally and only when present. All physiological/medical lines forbidden.
4. **Schema & UI additions:** Added optional `goodHabits` array (max 3) to schema; rendered as "What you are already doing well" card in the UI when present. Empty swaps section is cleanly hidden.
5. **Cross-section topic duplicate detection:** Enhanced `findRepeatedAdvice` to track topic signatures across distinct sections in addition to sentence-level near-duplicates.

### Why these changes

Language models hallucinate equipment ownership and repeat advice when given free-form knowledge bases. Confining the model to rewrite deterministic, code-selected topics guarantees that advice matches the user's setup and eliminates cross-section duplication.

### Changes after testing

_(Placeholder for future iterations and calibration observations)_

---

## v2 (Archived) — `api/_lib/plan/prompts/plan-prompt.ts`

### Problems observed in v1 output

1. **Generic headline and summary.** The headline and summary were generic ("Managing Your Environment During Poor Air Quality", "Focus on keeping your indoor space clean") and ignored the person's role, commute and household.
2. **Repeated advice across sections.** The same advice repeated across sections: "wet mopping" and "keep windows closed" each appeared in a daily slot, in Indoor Air and again in Impact; the Impact section restated advice already given in the daily plan and swaps.
3. **Redundant air quality check instruction.** A morning action said "check local air quality reports", which was useless because the app already displays air quality.
4. **Household members needing care were ignored.** Someone at home who needs extra care (`vulnerableHome`) was not reflected in the plan.

### Changes made

1. Headline rules (role + biggest factor, no "Managing", no generic AQI restatement).
2. Summary rule (must cite at least two specific facts in plain words).
3. Daily plan rules (fact-tied actions, verb repetition limits, room-cleaning action for vulnerable households, no checking air reports).
4. Non-repetition rules & sentence normalisation check.
5. AQI band calibration.

### Changes after testing

_Identified equipment inversion bugs, generic non-customized swaps/indoor tips, and cross-section topic overlap. Resolved in v3._

---

## v1 (Archived) — `api/_lib/plan/prompts/plan-prompt-v1.ts`

### Goal

Generate a personalized, clear, and reassuring daily air quality plan tailored to the user's specific routine, role, household vulnerabilities, and current city AQI.
