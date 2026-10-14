import { describe, it, expect, vi } from "vitest";
import { PRODUCTS } from "../data/products";
import {
  ProductSchema,
  CartItemSchema,
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
  inStock: true,
  colors: ["Noir"],
  sizes: ["S", "M"],
  image: "https://example.com/x.jpg",
  description: { fr: "X", en: "Y" },
};

describe("ProductSchema", () => {
  it("validates every catalogue sample", () => {
    expect(PRODUCTS.every((product) => ProductSchema.safeParse(product).success)).toBe(true);
  });

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

  it("allows a product without a comparison price", () => {
    const ok = { ...validProduct, originalPrice: null };
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
