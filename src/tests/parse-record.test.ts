import { describe, expect, it } from "vitest";
import { parseIstDate, parseRecord } from "../../api/_lib/parse-record.js";

describe("parseIstDate", () => {
  it("parses valid IST date format dd-mm-yyyy hh:mm:ss to UTC Date", () => {
    // 22-11-2026 12:30:00 IST is UTC 07:00:00 (IST is UTC+05:30)
    const date = parseIstDate("22-11-2026 12:30:00");
    expect(date).not.toBeNull();
    expect(date?.toISOString()).toBe("2026-11-22T07:00:00.000Z");
  });

  it("returns null for malformed date strings", () => {
    expect(parseIstDate("")).toBeNull();
    expect(parseIstDate("invalid-date")).toBeNull();
    expect(parseIstDate("2026-11-22")).toBeNull();
  });
});

describe("parseRecord", () => {
  it("converts a valid raw CPCB record to a ParsedReading", () => {
    const raw = {
      country: "India",
      state: "Delhi",
      city: "Delhi",
      station: "Anand Vihar, Delhi - DPCC",
      last_update: "22-11-2026 12:30:00",
      latitude: "28.6508",
      longitude: "77.3152",
      pollutant_id: "PM2.5",
      min_value: "100",
      max_value: "350",
      avg_value: "220",
    };

    const parsed = parseRecord(raw);
    expect(parsed).toEqual({
      station: "Anand Vihar, Delhi - DPCC",
      pollutantId: "PM2.5",
      avgValue: 220,
      updatedAt: new Date("2026-11-22T07:00:00.000Z"),
    });
  });

  it("skips NA, empty, and non-numeric avg_value", () => {
    const base = {
      station: "Station A",
      pollutant_id: "PM10",
      last_update: "22-11-2026 12:30:00",
    };

    expect(parseRecord({ ...base, avg_value: "NA" })).toBeNull();
    expect(parseRecord({ ...base, avg_value: "" })).toBeNull();
    expect(parseRecord({ ...base, avg_value: "   " })).toBeNull();
    expect(parseRecord({ ...base, avg_value: "invalid" })).toBeNull();
    expect(parseRecord({ ...base, avg_value: "-10" })).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    expect(parseRecord({ avg_value: "100" })).toBeNull();
    expect(parseRecord({ station: "A", avg_value: "100" })).toBeNull();
  });
});
