import { describe, it, expect } from "vitest";
import { formatPrice } from "../data/translations";

describe("formatPrice", () => {
  it("formats CAD in FR locale", () => {
    const out = formatPrice(1234.5, "fr");
    expect(out).toContain("1");
    expect(out).toContain("$");
    expect(out).toContain("34,50"); // FR-CA uses comma decimal
  });

  it("formats CAD in EN locale", () => {
    const out = formatPrice(1234.5, "en");
    expect(out).toContain("$");
    expect(out).toContain("1,234.50");
  });

  it("handles zero", () => {
    const out = formatPrice(0, "fr");
    expect(out).toMatch(/0/);
  });

  it("falls back gracefully on invalid input", () => {
    const out = formatPrice(NaN, "fr");
    expect(out).toBeDefined();
    expect(typeof out).toBe("string");
  });
});
