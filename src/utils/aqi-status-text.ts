export interface StatusPillInfo {
  text: string;
  dotColorClass: string;
}

export function formatCapturedTime(
  isoString: string | null | undefined
): string | null {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return null;
    const formatted = d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formatted} IST`;
  } catch {
    return null;
  }
}

export function getStatusPill(
  sampleMode: boolean,
  capturedAtIso?: string | null
): StatusPillInfo {
  if (!sampleMode) {
    return {
      text: "Live CPCB readings · 23 Indian cities",
      dotColorClass: "bg-teal",
    };
  }

  const formatted = formatCapturedTime(capturedAtIso);
  const timeSuffix = formatted ? `saved ${formatted}` : "saved";
  return {
    text: `Sample data · ${timeSuffix}`,
    dotColorClass: "bg-amber",
  };
}

export interface AqiSourceTextOptions {
  sampleMode?: boolean;
  source?: "cpcb" | "open-meteo" | "manual" | "sample";
  isManual?: boolean;
  stationsCount?: number;
  updatedTime?: string;
  capturedAt?: string | null;
}

function formatAqiTime(isoOrTime?: string | null): string {
  if (!isoOrTime) return "--:--";
  const d = new Date(isoOrTime);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return isoOrTime;
}

export function getAqiCardSourceText(options: AqiSourceTextOptions): string {
  const {
    sampleMode = false,
    source = "cpcb",
    isManual = false,
    stationsCount,
    updatedTime,
    capturedAt,
  } = options;

  if (isManual || source === "manual") {
    return "Entered by you";
  }

  if (sampleMode || source === "sample") {
    const timeLabel = formatAqiTime(capturedAt ?? updatedTime);
    return `Saved CPCB reading, captured ${timeLabel}`;
  }

  const timeLabel = formatAqiTime(updatedTime);
  if (source === "open-meteo") {
    return `Modelled estimate (Open-Meteo / CAMS), not a station reading, updated ${timeLabel}`;
  }

  if (stationsCount !== undefined) {
    const suffix = stationsCount === 1 ? "" : "s";
    return `Estimate from ${stationsCount} CPCB station${suffix}, updated ${timeLabel}`;
  }

  return `Updated ${timeLabel}`;
}
