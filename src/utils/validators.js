// Runtime validators using Zod.
// Validate catalogue samples and protect localStorage reads.

import { z } from "zod";

export const TranslatableSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

export const GenderSchema = z.enum(["femme", "homme", "enfant"]);

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  name: TranslatableSchema,
  category: TranslatableSchema,
  gender: GenderSchema,
  price: z.number().nonnegative(),
  originalPrice: z.number().positive().nullable(),
  inStock: z.boolean(),
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
