import { describe, expect, it, vi } from "vitest";
import { fetchCpcbRecords } from "../../api/_lib/fetch-cpcb.js";

describe("fetchCpcbRecords", () => {
  const dummyKey = "test-api-key";
  const noopSleep = vi.fn().mockResolvedValue(undefined);

  it("retries on empty records array and succeeds when subsequent response contains records", async () => {
    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          ok: true,
          json: async () => ({ status: "ok", records: [] }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({
          status: "ok",
          records: [
            {
              station: "S1",
              pollutant_id: "PM2.5",
              avg_value: "100",
              last_update: "22-11-2026 12:00:00",
            },
          ],
        }),
      } as Response;
    });

    const result = await fetchCpcbRecords("Delhi", "Delhi", dummyKey, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.records).toHaveLength(1);
    }
    expect(callCount).toBe(2);
    expect(noopSleep).toHaveBeenCalledWith(300);
  });

  it("gives up and returns error after exhausting maximum retries", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await fetchCpcbRecords("Delhi", "Delhi", dummyKey, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
      maxRetries: 2,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("upstream_error");
    }
    // initial attempt + 2 retries = 3 calls
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("handles timeout aborts gracefully and treats them as upstream errors", async () => {
    const mockFetch = vi.fn().mockImplementation((_url, { signal }) => {
      return new Promise((_, reject) => {
        signal.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted", "AbortError"));
        });
      });
    });

    const result = await fetchCpcbRecords("Delhi", "Delhi", dummyKey, {
      fetchFn: mockFetch,
      sleepFn: noopSleep,
      timeoutMs: 10,
      maxRetries: 1,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("upstream_error");
    }
  });
});
