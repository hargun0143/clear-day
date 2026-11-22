import type { CpcbRawRecord, ParsedReading } from "./cpcb-types.js";

const DATE_REGEX =
  /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/;

export function parseIstDate(dateStr: string): Date | null {
  const trimmed = dateStr.trim();
  const match = DATE_REGEX.exec(trimmed);
  if (!match) return null;

  const [, day, month, year, hour, minute, second] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}+05:30`;

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

export function parseRecord(record: CpcbRawRecord): ParsedReading | null {
  const station = record.station?.trim();
  const pollutantId = record.pollutant_id?.trim();
  const rawAvg = record.avg_value?.trim();
  const lastUpdate = record.last_update?.trim();

  if (!station || !pollutantId || !rawAvg || !lastUpdate) {
    return null;
  }

  if (rawAvg === "NA" || rawAvg === "") {
    return null;
  }

  const avgValue = Number(rawAvg);
  if (!Number.isFinite(avgValue) || avgValue < 0) {
    return null;
  }

  const updatedAt = parseIstDate(lastUpdate);
  if (!updatedAt) {
    return null;
  }

  return {
    station,
    pollutantId,
    avgValue,
    updatedAt,
  };
}
