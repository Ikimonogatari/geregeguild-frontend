import { describe, expect, it } from "vitest";
import { formatPrice, formatPriceRange } from "./format";

describe("formatPrice", () => {
  it("thousands-separates a plain USD figure", () => {
    expect(formatPrice(1200)).toBe("$1,200");
    expect(formatPrice(48000)).toBe("$48,000");
  });

  it("handles zero without weirdness", () => {
    expect(formatPrice(0)).toBe("$0");
  });
});

describe("formatPriceRange", () => {
  it("renders a from–to range", () => {
    expect(formatPriceRange(1200, 4800)).toBe("$1,200 – $4,800");
  });

  it("collapses a 0–0 range to the by-design label", () => {
    expect(formatPriceRange(0, 0)).toBe("By design");
  });

  it("still renders when only `to` is zero", () => {
    expect(formatPriceRange(1200, 0)).toBe("$1,200 – $0");
  });
});
