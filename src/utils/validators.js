// Runtime validators using Zod.
// Catches bad data at module load (dev) and protects localStorage reads (prod).

import { z } from "zod";

export const TranslatableSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

export const GenderSchema = z.enum(["femme", "homme", "enfant"]);

export const BadgeSchema = z
  .enum(["bestseller", "new", "limited", "sale", "exclusive"])
  .nullable();

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: TranslatableSchema,
  category: TranslatableSchema,
  gender: GenderSchema,
  price: z.number().nonnegative(),
  originalPrice: z.number().positive().nullable(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  inStock: z.boolean(),
  badge: BadgeSchema,
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  image: z.string().url(),
  description: TranslatableSchema,
});

export const ProductListSchema = z.array(ProductSchema);

export const CartItemSchema = z.object({
  id: z.number().int().positive(),
  name: TranslatableSchema,
  price: z.number().nonnegative(),
  image: z.string(),
  category: TranslatableSchema,
  size: z.string(),
  color: z.string(),
  qty: z.number().int().positive().max(99),
});

export const CartSchema = z.array(CartItemSchema);

export const ShippingAddressSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(2).max(2),
  postal: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid Canadian postal code"),
  phone: z.string().optional().default(""),
});

export const OrderSchema = z.object({
  orderNumber: z.string().regex(/^LM-[A-Z0-9]+$/),
  email: z.string().email(),
  name: z.string().min(1),
  total: z.number().nonnegative(),
  itemsCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  lang: z.enum(["fr", "en"]),
});

export const ConsentSchema = z.object({
  essential: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  ts: z.number().optional(),
});

/**
 * Safe parse helper — returns parsed data or fallback on failure.
 * Logs in dev, silent in prod.
 *
 * @template T
 * @param {z.ZodSchema<T>} schema
 * @param {unknown} data
 * @param {T} fallback
 * @returns {T}
 */
export function safeParse(schema, data, fallback) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  if (import.meta.env.DEV) {
    console.warn("[validators] safeParse failed:", result.error.format());
  }
  return fallback;
}

/**
 * Filter an array, keeping only items that match the schema.
 *
 * @template T
 * @param {z.ZodSchema<T>} schema
 * @param {unknown[]} arr
 * @returns {T[]}
 */
export function filterValid(schema, arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((it) => schema.safeParse(it).success);
}
