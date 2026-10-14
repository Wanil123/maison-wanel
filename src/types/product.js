// Shared JSDoc typedefs. Import via `/** @typedef {import('./types/product').Product} Product */`
// in any file that wants IDE-level type-checking without a TS migration.

/**
 * @typedef {Object} Translatable
 * @property {string} fr
 * @property {string} en
 */

/**
 * @typedef {"femme" | "homme" | "enfant"} Gender
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {Translatable} name
 * @property {Translatable} category
 * @property {Gender} gender
 * @property {number} price
 * @property {number | null} originalPrice
 * @property {boolean} inStock
 * @property {string[]} colors
 * @property {string[]} sizes
 * @property {string} image
 * @property {Translatable} description
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {Translatable} name
 * @property {number} price
 * @property {string} image
 * @property {Translatable} category
 * @property {string} size
 * @property {string} color
 * @property {number} qty
 */

/**
 * @typedef {"success" | "error" | "warning" | "info"} ToastType
 * @typedef {Object} Toast
 * @property {number} id
 * @property {string} message
 * @property {ToastType} type
 */

export {};
