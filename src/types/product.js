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
 * @typedef {"bestseller" | "new" | "limited" | "sale" | "exclusive" | null} BadgeVariant
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {Translatable} name
 * @property {Translatable} category
 * @property {Gender} gender
 * @property {number} price
 * @property {number | null} originalPrice
 * @property {number} rating
 * @property {number} reviews
 * @property {boolean} inStock
 * @property {BadgeVariant} badge
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
 * @typedef {Object} ShippingAddress
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} city
 * @property {string} province
 * @property {string} postal
 * @property {string} phone
 */

/**
 * @typedef {Object} Order
 * @property {string} orderNumber       // "LM-XXXXXXXX"
 * @property {string} email
 * @property {string} name
 * @property {number} total
 * @property {number} itemsCount
 * @property {string} createdAt         // ISO 8601
 * @property {"fr" | "en"} lang
 */

/**
 * @typedef {"success" | "error" | "warning" | "info"} ToastType
 * @typedef {Object} Toast
 * @property {number} id
 * @property {string} message
 * @property {ToastType} type
 */

/**
 * @typedef {Object} ConsentState
 * @property {boolean} essential
 * @property {boolean} analytics
 * @property {boolean} marketing
 * @property {number} [ts]
 */

export {};
