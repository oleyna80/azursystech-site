type JsonReadResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "too_large" | "unreadable" };

export async function readJsonWithLimit<T>(
  request: Request,
  maxBytes: number,
): Promise<JsonReadResult<T>> {
  if (!request.body) {
    return { ok: false, reason: "unreadable" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large" };
      }

      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  const body = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder().decode(body);
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false, reason: "unreadable" };
  }
}
