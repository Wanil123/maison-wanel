import { describe, expect, it } from "vitest";
import { calculateCart } from "./pricing";

describe("calculateCart", () => {
  it("keeps promo, shipping and estimated tax consistent for checkout", () => {
    expect(calculateCart([{ price: 80, qty: 1 }], "LUXE10")).toEqual({
      subtotal: 80,
      discount: 8,
      shipping: 15,
      tax: 10.8,
      total: 97.8,
    });
  });

  it("uses the free-shipping threshold and safely ignores unknown codes", () => {
    expect(calculateCart([{ price: 60, qty: 2 }], "UNKNOWN")).toEqual({
      subtotal: 120,
      discount: 0,
      shipping: 0,
      tax: 18,
      total: 138,
    });
  });

  it("does not add shipping or tax to an empty cart", () => {
    expect(calculateCart([])).toEqual({ subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0 });
  });
});
