import { describe, expect, it } from "vitest";

import nextConfig from "../../../next.config";

describe("legacy AI automation redirect", () => {
  it("keeps the legacy route as a permanent redirect to French", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/ai-automation",
      destination: "/fr/ai-automation",
      permanent: true,
    });
  });
});
