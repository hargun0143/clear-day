# Prompt Log: Plan Generation

## v3.1 (Current) — `api/_lib/plan/prompts/plan-prompt.ts`

### Problems observed in v3 output

1. **Selected topics dropped:** A smoker's Indoor Air had no smoking tip, an AC owner had no AC tip, and a purifier owner's "already doing well" card omitted the purifier and public transport.
2. **Banned phrases appeared:** Phrases like "Check local air quality before leaving for class" appeared in generated daily slots.
3. **Contradictory advice:** The summary told a household with indoor smoking to "focus on ventilation" while the outdoor AQI was Poor (windows should stay closed).
4. **Missing top factors:** The impact section missed the person's biggest factor (indoor smoking).
5. **Commute guidance omitted:** Car and metro commuters received no specific commute precautions.
6. **Excessive equipment repetition:** Air purifier was mentioned up to four times across the plan.
7. **Thin plans & latency/503 fallback:** Thin daily slots with a single action, 15-20s latency, and occasional 503 errors resulting in fallback.

### Changes made

1. **Topic Coverage Guarantee:**
   - Added `topicId` string to `indoorAir.tips`, `lowEmissionChoices`, and `goodHabits` schemas and Gemini schema definitions.
   - Implemented `enforceTopicCoverage` in code to drop unselected topics and automatically fill any missing selected topics with vetted default text in deterministic order.
2. **Banned Phrases & Equipment Limits:**
   - Implemented `findBannedPhrases` checking blocklist ("check local air quality", "check the air quality", "vulnerable home", "breathing steady", "calm your lungs", and relaxing breathing variants).
   - Implemented `findEquipmentViolations` to enforce ≤2 mentions per equipment type across the plan and ≤1 mention of purifier outside `indoorAir`.
   - Merged detection into a single correction retry; post-retry sanitizer removes offending actions or replaces with vetted defaults.
3. **Smoking and Ventilation Rules:**
   - Added vetted neutral guidance to knowledge sheet: smoke outside and away from windows/doors, never in rooms where others spend time.
   - Added strict prompt rule prohibiting ventilation advice when AQI is 101 or above.
4. **Commute Tips per Mobility:**
   - Added mobility-specific commute topics to knowledge sheet and prompt: car, bus-or-metro, two-wheeler/bicycle, walk. Mandated inclusion in Morning or Afternoon daily slots.
5. **Top Factors for Impact:**
   - Added pure `selectTopFactors` with a documented weight table (smoking, outdoor hours, biomass cooking, vehicle commute, no purifier with care, no exhaust). Exposed `topFactors` on `FactSheet` and prompt.
6. **Minimum Content Enforcement:**
   - Enforced 2-3 actions for Morning, Afternoon, Evening and 1-2 actions for Night in Zod schema and post-processing filler.
7. **Reliability & Speed:**
   - Added `GEMINI_FALLBACK_MODEL` env variable and fallback retry logic on 429/5xx errors within the 2-attempt budget.
   - Disabled Gemini thinking budget (`thinkingConfig: { thinkingBudget: 0 }`) on supported models to eliminate 15-20s latency.
   - Added in-memory client cache (`Map`) in `plan-client.ts` for instant repeat plan retrieval without caching fallbacks. Added dev timing logs.

### Why these changes

Models occasionally omit selected topics or hallucinate forbidden phrases under open-ended generation. Adding machine-readable topic IDs and deterministic post-validation code guarantees complete coverage, while client-side caching and thinking suppression ensure instant, robust generation.

### Changes after testing

_(Placeholder for future iterations and calibration observations)_

---

## v3 (Archived) — `api/_lib/plan/prompts/plan-prompt.ts`

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

_(Identified topic drops, banned phrases, contradictory ventilation, and missing commute tips. Resolved in v3.1)_

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
