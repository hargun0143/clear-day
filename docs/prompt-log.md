# Prompt Log: Plan Generation

## v1 (Current)

### Goal

Generate a personalized, clear, and reassuring daily air quality plan tailored to the user's specific routine, role, household vulnerabilities, and current city AQI.

### Design Choices

1. **Facts from Code Only**: All quantitative information (AQI value, band label, primary guidance line, vulnerability flags, role labels) is computed deterministically in pure TypeScript code (`buildFactSheet`).
2. **Gemini for Wording and Personalisation Only**: Gemini is instructed never to supply or extrapolate an AQI value, health statistic, exposure duration, or medical diagnosis. It solely personalizes the prose and schedule slots around the supplied vetted knowledge.
3. **Safety and Minor Handling**: When `isUnder18` is true, lifestyle emission swaps and financial purchases are suppressed completely, and the DIY box fan filter is forced with an "ask an adult" requirement.
4. **Structured JSON Output**: A strict JSON schema enforced via Gemini API's `responseSchema` and post-processed with Zod validation in code (`postProcessPlan`) guarantees structural integrity and trims any over-length content.

### Changes after testing

_(Placeholder for future iterations and calibration observations)_
