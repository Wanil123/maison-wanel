import { describe, it, expect, vi } from "vitest";
import {
  ProductSchema,
  CartItemSchema,
  ShippingAddressSchema,
  ConsentSchema,
  safeParse,
  filterValid,
} from "./validators";

const validProduct = {
  id: 1,
  name: { fr: "Robe", en: "Dress" },
  category: { fr: "Robes", en: "Dresses" },
  gender: "femme",
  price: 100,
  originalPrice: 150,
  rating: 4.5,
  reviews: 12,
  inStock: true,
  badge: "new",
  colors: ["Noir"],
  sizes: ["S", "M"],
  image: "https://example.com/x.jpg",
  description: { fr: "X", en: "Y" },
};

describe("ProductSchema", () => {
  it("accepts a valid product", () => {
    expect(ProductSchema.safeParse(validProduct).success).toBe(true);
  });

  it("rejects bad gender", () => {
    const bad = { ...validProduct, gender: "alien" };
    expect(ProductSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects negative price", () => {
    const bad = { ...validProduct, price: -1 };
    expect(ProductSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const bad = { ...validProduct, rating: 6 };
    expect(ProductSchema.safeParse(bad).success).toBe(false);
  });

  it("allows null originalPrice and null badge", () => {
    const ok = { ...validProduct, originalPrice: null, badge: null };
    expect(ProductSchema.safeParse(ok).success).toBe(true);
  });
});

describe("CartItemSchema", () => {
  it("caps qty at 99", () => {
    const item = {
      id: 1, name: { fr: "x", en: "x" }, price: 10,
      image: "https://x", category: { fr: "y", en: "y" },
      size: "M", color: "Noir", qty: 100,
    };
    expect(CartItemSchema.safeParse(item).success).toBe(false);
  });
});

describe("ShippingAddressSchema", () => {
  it("accepts valid CA postal codes", () => {
    const ok = {
      email: "a@b.com", firstName: "A", lastName: "B",
      address: "1 rue X", city: "Montréal", province: "QC",
      postal: "H2X 1Y4", phone: "514-555-0123",
    };
    expect(ShippingAddressSchema.safeParse(ok).success).toBe(true);
  });

  it("rejects bad postal codes", () => {
    const bad = {
      email: "a@b.com", firstName: "A", lastName: "B",
      address: "1 rue X", city: "Montréal", province: "QC",
      postal: "12345",
    };
    expect(ShippingAddressSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects bad emails", () => {
    const bad = {
      email: "not-an-email", firstName: "A", lastName: "B",
      address: "1", city: "M", province: "QC", postal: "H2X 1Y4",
    };
    expect(ShippingAddressSchema.safeParse(bad).success).toBe(false);
  });
});

describe("ConsentSchema", () => {
  it("accepts valid consent", () => {
    expect(ConsentSchema.safeParse({ essential: true, analytics: false, marketing: false }).success).toBe(true);
  });
});

describe("safeParse helper", () => {
  it("returns parsed data on success", () => {
    expect(safeParse(ProductSchema, validProduct, null)).toEqual(validProduct);
  });

  it("returns fallback on failure", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fb = { foo: "bar" };
    expect(safeParse(ProductSchema, { junk: 1 }, fb)).toBe(fb);
    vi.restoreAllMocks();
  });
});

describe("filterValid helper", () => {
  it("returns only items that match the schema", () => {
    const items = [validProduct, { broken: true }, { ...validProduct, id: 2 }];
    expect(filterValid(ProductSchema, items)).toHaveLength(2);
  });

  it("returns empty array for non-array input", () => {
    expect(filterValid(ProductSchema, null)).toEqual([]);
    expect(filterValid(ProductSchema, "string")).toEqual([]);
  });
});
