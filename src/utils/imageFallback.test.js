import { describe, it, expect } from "vitest";
import { getProductFallback } from "./imageFallback";

describe("imageFallback", () => {
  it("returns a data:image/svg+xml URI", () => {
    const url = getProductFallback({ seed: 1, label: "Robe", category: "Robes" });
    expect(url.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });

  it("is deterministic for the same seed/label", () => {
    const a = getProductFallback({ seed: 5, label: "Sac", category: "Sacs" });
    const b = getProductFallback({ seed: 5, label: "Sac", category: "Sacs" });
    expect(a).toBe(b);
  });

  it("uses different palettes for different seeds", () => {
    const a = getProductFallback({ seed: 1, label: "X" });
    const b = getProductFallback({ seed: 2, label: "X" });
    expect(a).not.toBe(b);
  });

  it("handles missing label gracefully", () => {
    expect(() => getProductFallback({ seed: 0 })).not.toThrow();
  });

  it("escapes special characters in label/category", () => {
    const url = getProductFallback({ seed: 7, label: '<script>', category: '"& bla' });
    expect(url.startsWith("data:image/svg+xml;base64,")).toBe(true);
    // Decode and ensure no raw <script> in payload
    const decoded = atob(url.split(",")[1]);
    expect(decoded).not.toContain("<script>");
  });
});
