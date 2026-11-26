import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ViewFallback } from "@/components/layout/view-fallback";

describe("ViewFallback", () => {
  it("renders with role status and polite aria-live", () => {
    const html = renderToStaticMarkup(<ViewFallback />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("Loading...");
  });

  it("renders custom label when provided", () => {
    const html = renderToStaticMarkup(
      <ViewFallback label="Loading questionnaire..." />
    );
    expect(html).toContain("Loading questionnaire...");
  });
});
