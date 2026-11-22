import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CITY_IDS = [
  "delhi",
  "mumbai",
  "bengaluru",
  "kolkata",
  "chennai",
  "hyderabad",
  "pune",
  "ahmedabad",
  "jaipur",
  "lucknow",
  "patna",
  "chandigarh",
  "bhopal",
  "kanpur",
  "varanasi",
  "gurugram",
  "noida",
  "ghaziabad",
  "nagpur",
  "visakhapatnam",
  "guwahati",
  "indore",
  "thiruvananthapuram",
];

const BASE_URL = "http://localhost:5173/api/aqi";
const TIMEOUT_MS = 15000;
const PAUSE_MS = 2000;
const MAX_RETRIES = 1;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchCity(cityId) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(
        `${BASE_URL}?city=${encodeURIComponent(cityId)}`,
        {
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        if (attempt === MAX_RETRIES) return null;
        await sleep(1000);
        continue;
      }

      return await res.json();
    } catch {
      if (attempt === MAX_RETRIES) return null;
      await sleep(1000);
    } finally {
      clearTimeout(timeoutId);
    }
  }
  return null;
}

async function main() {
  console.log(`Starting snapshot capture for ${CITY_IDS.length} cities...`);
  const readings = {};
  const succeeded = [];
  const failed = [];

  for (let i = 0; i < CITY_IDS.length; i++) {
    const cityId = CITY_IDS[i];
    console.log(`[${i + 1}/${CITY_IDS.length}] Fetching ${cityId}...`);

    const result = await fetchCity(cityId);
    if (result && typeof result.aqi === "number") {
      readings[cityId] = result;
      succeeded.push(cityId);
      console.log(`  ✓ ${cityId}: AQI ${result.aqi} (${result.source})`);
    } else {
      failed.push(cityId);
      console.log(`  ✗ ${cityId}: Failed to retrieve data`);
    }

    if (i < CITY_IDS.length - 1) {
      await sleep(PAUSE_MS);
    }
  }

  const payload = {
    capturedAt: new Date().toISOString(),
    readings,
  };

  const targetPath = path.resolve(
    __dirname,
    "../src/data/sample-snapshot.json"
  );
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log("\n--- Snapshot Summary ---");
  console.log(`Total cities: ${CITY_IDS.length}`);
  console.log(`Succeeded (${succeeded.length}): ${succeeded.join(", ")}`);
  console.log(
    `Failed (${failed.length}): ${failed.length ? failed.join(", ") : "None"}`
  );
  console.log(`Saved to ${targetPath}`);
}

main().catch((err) => {
  console.error("Fatal error capturing snapshot:", err);
  process.exit(1);
});
