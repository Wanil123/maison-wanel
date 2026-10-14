import { memo, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import { getProductFallback } from "../utils/imageFallback";
import Badge from "./ui/Badge";

const COLOR_MAP = {
  noir: "#111", black: "#111",
  blanc: "#fff", white: "#fff",
  marron: "#8B4513", brown: "#8B4513",
  cognac: "#C68E17",
  beige: "#F5F5DC",
  gris: "#808080", grey: "#808080",
  camel: "#C19A6B",
  indigo: "#4B0082",
  or: "#C9A96E", gold: "#C9A96E",
  argent: "#C0C0C0", silver: "#C0C0C0",
  "bleu marine": "#000080", navy: "#000080",
  rouge: "#C41E3A", red: "#C41E3A",
  rose: "#F4C2C2", pink: "#F4C2C2",
  "rose poudré": "#E8C4C4",
  champagne: "#F7E7CE",
  bordeaux: "#6B2D4A",
  lavande: "#B57EDC",
  "bleu ciel": "#87CEEB",
  havane: "#8B6914",
  crème: "#FFFDD0",
  nude: "#E3BC9A",
};

const getColorHex = (color) => COLOR_MAP[color.toLowerCase?.()] || "#ccc";

const getThumbUrl = (url) => {
  if (!url) return url;
  if (url.includes("unsplash.com")) {
    return url.replace(/w=\d+/, "w=600").replace(/q=\d+/, "q=75");
  }
  if (url.includes("pexels.com")) {
    return url.replace(/w=\d+/, "w=600");
  }
  return url;
};

function ProductCard({ product, index = 0 }) {
  const { lang, addToCart, toggleWishlist, isWishlisted } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const T = STR[lang];
  const wishlisted = isWishlisted(product.id);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(100 - (product.price / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = useCallback(() => {
    addToCart(product, {
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
      qty: 1,
    });
  }, [addToCart, product]);

  const handleWishlist = useCallback(() => {
    toggleWishlist(product);
  }, [toggleWishlist, product]);

  const cappedDelay = Math.min(index, 6) * 0.04;
  const fallback = useMemo(
    () => getProductFallback({ seed: product.id, label: product.name[lang], category: product.category[lang], w: 600, h: 800 }),
    [product.id, product.name, product.category, lang]
  );
  const thumbSrc = imageError ? fallback : getThumbUrl(product.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: cappedDelay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative"
    >
      <div className="relative bg-white dark:bg-luxury-charcoal/40 rounded-xl sm:rounded-2xl overflow-hidden luxury-card border border-gray-100 dark:border-luxury-charcoal">
          <Link
            to={`/product/${product.id}`}
            aria-label={`${product.name[lang]} — ${formatPrice(product.price, lang)}`}
            className="absolute inset-0 z-30 rounded-xl sm:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          />
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-luxury-noir">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 skeleton" aria-hidden="true" />
            )}

            <img
              src={thumbSrc}
              alt={product.name[lang]}
              width={600}
              height={800}
              className="relative z-10 w-full h-full object-cover img-zoom"
              loading={index < 6 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : "auto"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(true); }}
            />

            {/* Hover overlay (CSS only) */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-noir/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badges — mobile petits, desktop normaux */}
            <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
              {discount > 0 && (
                <Badge variant="sale" size="sm" className="sm:!px-3 sm:!py-1 sm:!text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Wishlist — petit sur mobile pour 3 col */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`
                absolute z-40 top-1.5 right-1.5 sm:top-3 sm:right-3
                w-9 h-9 sm:w-10 sm:h-10 rounded-full
                flex items-center justify-center
                transition-all duration-300 shadow-lg
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                ${
                  wishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/95 dark:bg-luxury-noir/90 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white"
                }
              `}
              aria-label={wishlisted ? T.remove_from_wishlist : T.add_to_wishlist}
              aria-pressed={wishlisted}
            >
                <Heart
                className={`w-4 h-4 transition-all ${wishlisted ? "fill-current" : ""}`}
                aria-hidden="true"
              />
            </button>

            {/* Quick add — desktop hover only (les mobiles tapent directement la card) */}
            <div className="hidden sm:block absolute z-40 bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!product.inStock}
                className={`
                  w-full py-3 rounded-xl font-medium text-sm
                  flex items-center justify-center gap-2 backdrop-blur-sm
                  transition-colors duration-300 shadow-lg
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${
                    product.inStock
                      ? "bg-white/95 text-luxury-noir hover:bg-accent hover:text-luxury-noir"
                      : "bg-gray-300/80 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                {product.inStock ? T.add_to_cart : T.unavailable}
              </button>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-luxury-noir/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <span className="px-2 py-1 sm:px-5 sm:py-2 bg-white/95 rounded-md sm:rounded-lg font-medium text-luxury-noir text-[10px] sm:text-sm tracking-wide">
                  {T.coming_soon}
                </span>
              </div>
            )}
          </div>

          {/* Info — compact mobile, normal desktop */}
          <div className="p-2 sm:p-4 lg:p-5">
            <div className="flex items-center justify-between mb-1 sm:mb-2.5">
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.15em] text-accent truncate max-w-[70%]">
                {product.category[lang]}
              </span>
            </div>

            <h3 className="font-serif font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 sm:mb-2.5 text-sm sm:text-base lg:text-lg leading-tight group-hover:text-accent transition-colors duration-300">
              {product.name[lang]}
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </span>
              {product.originalPrice > product.price && (
                <span className="hidden sm:inline text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice, lang)}
                </span>
              )}
            </div>

            {/* Pastilles couleur — cachées si trop étroit (mobile 3 col) */}
            {product.colors?.length > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 mt-3"
                aria-label={`${product.colors.length} ${lang === "fr" ? "coloris" : "colors"}`}
              >
                {product.colors.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-luxury-charcoal shadow-sm ring-1 ring-gray-200 dark:ring-luxury-noir"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                    aria-hidden="true"
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-gray-400 ml-1 font-medium">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Compteur couleurs minimal sur mobile */}
            {product.colors?.length > 0 && (
              <div className="sm:hidden mt-1 text-[9px] text-gray-400 uppercase tracking-wider">
                {product.colors.length} {lang === "fr" ? "coloris" : "colors"}
              </div>
            )}
          </div>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
