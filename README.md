# Clear Day

**A daily plan for smoggy days, built from real air-quality data and personalised with Gemini.**

Clear Day reads today's air quality for your Indian city from the CPCB's real-time feed, asks a few plain questions about your routine and home, and gives you a plan you can actually follow: what to do in the morning, afternoon, evening and at night, how to clean the air at home (including a do-it-yourself box-fan filter), which low-emission choices matter for you, and why each one helps.

- Live app: [LIVE_URL]
- Demo video: [DEMO_VIDEO_URL]
- Built for the PromptWars Virtual Challenge 6 (Urban Air Quality Assistant).

---

## The problem

In winter, smog turns normal routines into health decisions. Most air-quality apps stop at a number and a colour. Families still have to work out what that number means for a school run, a delivery shift, a kitchen with no chimney, or a grandparent at home. Generic advice ("stay indoors") is ignored because it doesn't fit anyone's real day.

## What Clear Day does

1. **Shows the real air quality** for 23 Indian cities, on the Indian National AQI scale, with the source and update time.
2. **Asks up to 8 short questions** that adapt to who you are: school student, college student, office worker, work from home, homemaker, delivery or outdoor worker, or retired. The age and role answers decide which questions follow.
3. **Builds a personalised plan**: a four-part daily routine, indoor-air actions, low-emission swaps, the habits you already do well, and the factors that matter most in your day, each with a one-line reason.
4. **Protects younger users**: under-18s always get the DIY air filter (with an "ask an adult" note) and never get purchase or lifestyle-swap advice.

## How it works

```
CPCB real-time data  ->  server function  ->  city AQI (code)
                                                   |
your answers  ->  fact sheet (code)  ->  topic selection (code)
                                                   |
                         Gemini rewrites the selected topics for you (wording only)
                                                   |
                   validation, topic coverage, banned-phrase checks (code)  ->  plan
```

**The principle: code owns the facts, Gemini owns the wording.**

- The AQI never comes from Gemini. It comes from CPCB data, with fallbacks (below).
- Your answers become a typed **fact sheet** (role, age band, household members who need extra care, home equipment, commute, outdoor hours, budget) plus derived flags.
- Plain code decides **which topics apply** (for example the smoking tip only if someone smokes indoors; the DIY filter only if there is no purifier and the budget is small, or the user is under 18).
- Gemini receives the fact sheet, the selected topics and strict rules, and returns **structured JSON**. It rewrites the topics in plain language for this person. It cannot add topics, invent numbers or make medical claims.
- The response is **validated against a schema**. Missing topics are filled from vetted text, banned phrases and repeated advice trigger one correction retry, and under-18 rules are re-applied in code.
- If Gemini is unavailable, a **fallback model** is tried, and then an honest saved example plan is shown with a visible notice.

The prompt and how it changed over time are documented in [`docs/prompt-log.md`](docs/prompt-log.md).

## Data sources and how the AQI is computed

| Source | Role |
|---|---|
| CPCB real-time air quality via data.gov.in | Primary. Station readings per pollutant. |
| Open-Meteo Air Quality API (CAMS model) | Fallback when CPCB has no fresh data. Modelled, clearly labelled. |
| Manual entry | Last resort. You type an AQI (0 to 500) and the app continues. |
| Saved sample snapshot | Used by the "Sample data" switch (real readings captured on a stated date). |

**City AQI (CPCB path):**
- Each station needs at least 3 distinct pollutants including PM2.5 or PM10, and readings no older than 3 hours.
- Station AQI = the highest pollutant value at that station. City AQI = the **median** across valid stations.
- The result is shown as an **estimate** with the number of stations and the update time.

**Open-Meteo path:** PM2.5 and PM10 concentrations are converted to the Indian National AQI with the CPCB breakpoint tables, and labelled as a modelled estimate, not a station reading.

**Bands:** Good 0-50, Satisfactory 51-100, Moderate 101-200, Poor 201-300, Very Poor 301-400, Severe 401-500. Values above 500 show as "Beyond scale (500+)". Invalid input is rejected.

### Assumptions and limits (please read)

- The CPCB feed reports min, max and average values per pollutant. We treat the average values as **pollutant sub-indices**, which matches the numbers observed in the feed (for example PM2.5 above PM10). We have not confirmed this against official CPCB documentation, so the AQI shown is an estimate and may differ from the official figure.
- Official AQI uses 24-hour averages. We use the latest available readings, so the app labels the result as an estimate.
- Open-Meteo values are modelled current concentrations, not 24-hour averages.
- Advice is general guidance written for the app, **not medical advice**. We deliberately do not state any exposure-time or health-outcome statistics, because they would be invented.

## Safety and responsible design

- No medical claims, diagnoses or invented statistics. A code-level blocklist removes phrases such as "check local air quality" and clinical wording.
- Under-18 rules are enforced in code, not only in the prompt.
- All questionnaire answers are chosen from fixed options, so no free text is ever sent to the model (this also removes prompt-injection risk from user input).
- Nothing is stored. Answers live in memory for the session and are not saved or logged.

## Accessibility

- Keyboard-operable throughout, visible focus rings, 44 px minimum touch targets.
- The questionnaire announces progress ("Step 3 of 8") to screen readers, moves focus to each new question and never advances by itself.
- The sample-data control is a real switch with the correct role and state.
- Respects reduced motion (animations stop), reduced transparency and forced colours.
- Colour is never the only signal: selected options show a tick, and AQI shows its band name next to the colour.

## Performance

- The questionnaire, the plan page and dialogs are lazy-loaded; the landing page loads without them.
- Motion library features are loaded lazily.
- The animated background uses one canvas, capped pixel ratio and frame rate, pauses when the tab is hidden, and uses fewer particles on small screens.
- Identical answers return a cached plan instantly during a session. Fallback plans are never cached.

## Security

- API keys live only in server-side environment variables (no `VITE_` prefix) and are never sent to the browser, logged, or returned in any response.
- The server accepts only known city ids and validates every input; request bodies are size-limited.
- Upstream errors are never leaked to the client.
- `npm audit` currently reports a dev-time dependency advisory in a build-tool dependency (picomatch). It is not part of the production bundle. [UPDATE AFTER FINAL npm audit]

## Tech stack

React 19, Vite, TypeScript (strict), Tailwind CSS v4, shadcn/ui with Radix primitives, Framer Motion, Vitest, oxlint and Prettier. Serverless functions on Vercel call the CPCB and Gemini APIs. The model name comes from environment variables, with an optional fallback model.

## Testing

180+ automated tests cover: AQI parsing and aggregation, band classification, Open-Meteo conversion, retry and timeout behaviour, the questionnaire logic for every role, topic selection, plan schema validation, coverage guarantees, banned phrases, retry budgets, the under-18 rules, the cache, the API handlers (including that no key is ever returned) and key UI components.

```
npm run lint
npm run test
npm run build
```

Files under `src/components/ui/` are generated by shadcn/ui and are left unmodified, so a few of them are longer than the 120-line limit applied to the rest of the code.

## Run it locally

```
npm install
cp .env.example .env.local      # then fill in your own keys
npm run dev
```

Environment variables (server-side only):

| Name | Purpose |
|---|---|
| `DATA_GOV_IN_API_KEY` | data.gov.in key for the CPCB feed |
| `GEMINI_API_KEY` | Google AI Studio key |
| `GEMINI_MODEL` | Primary Gemini model name |
| `GEMINI_FALLBACK_MODEL` | Optional model used on 429 or 5xx errors |

To refresh the sample snapshot with real data: start `npm run dev` in one terminal, then run `npm run snapshot` in another.

## Using GenAI responsibly in the build

Clear Day was built with an AI coding agent (Antigravity, powered by Gemini) following written prompts, with every change reviewed and tested by the author. The prompt history for both the product (the plan prompt) and the build process is documented in `docs/prompt-log.md`. Decisions about what data to trust, what Gemini is allowed to do, the safety rules and the design were made by the author.

## Credits and inspirations

- Air-quality data: Central Pollution Control Board (CPCB) via the Open Government Data Platform India (data.gov.in).
- Fallback data: [Open-Meteo.com](https://open-meteo.com/) (Copernicus CAMS model data), used under their terms for non-commercial use with attribution.
- Guidance reference: WHO global air quality guidelines.
- UI: shadcn/ui, Radix UI, Lucide icons, Framer Motion, Inter typeface.
- Visual inspiration (ideas only; all code is original): the button and glass-panel styles on 21st.dev, and aurora and flowing-line backgrounds there and on weather wind maps.
