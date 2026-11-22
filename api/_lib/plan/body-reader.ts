import type { IncomingMessage } from "node:http";

export const MAX_BODY_BYTES = 10 * 1024; // 10 kB

export async function readRequestBody(
  req: IncomingMessage
): Promise<{ ok: true; body: string } | { ok: false; error: string }> {
  const chunks: Buffer[] = [];
  let totalLength = 0;

  for await (const chunk of req) {
    totalLength += chunk.length;
    if (totalLength > MAX_BODY_BYTES) {
      return { ok: false, error: "Payload too large" };
    }
    chunks.push(chunk);
  }

  return { ok: true, body: Buffer.concat(chunks).toString("utf8") };
}
