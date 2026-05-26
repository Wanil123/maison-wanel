import { memo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import Badge from "./ui/Badge";

const FALLBACK_IMAGE = "https://picsum.photos/seed/luxemode/600/800";

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

  const handleQuickAdd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      size: product.sizes?.[0] || "",
      color: product.colors?.[0] || "",
      qty: 1,
    });
  }, [addToCart, product]);

  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }, [toggleWishlist, product]);

  const cappedDelay = Math.min(index, 6) * 0.05;
  const thumbSrc = imageError ? FALLBACK_IMAGE : getThumbUrl(product.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: cappedDelay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative"
    >
      <Link
        to={`/product/${product.id}`}
        aria-label={`${product.name[lang]} — ${formatPrice(product.price, lang)}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-ivory dark:focus-visible:ring-offset-gray-900 rounded-2xl"
      >
        <div className="relative bg-white dark:bg-luxury-charcoal/40 rounded-2xl overflow-hidden luxury-card border border-gray-100 dark:border-luxury-charcoal">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-luxury-noir">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 skeleton" aria-hidden="true" />
            )}

            <img
              src={thumbSrc}
              alt={product.name[lang]}
              width={600}
              height={800}
              className={`
                w-full h-full object-cover img-zoom motion-safe:transition-opacity duration-500
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
              loading={index < 4 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : "auto"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Hover overlay (CSS only, no re-renders) */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-noir/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.badge && (
                <Badge variant={product.badge} size="md" animated>
                  {T[product.badge]}
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="sale" size="md">
                  -{discount}%
                </Badge>
              )}
            </div>

            <button
              type="button"
              onClick={handleWishlist}
              className={`
                absolute top-3 right-3 w-10 h-10 rounded-full
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
              <Heart className={`w-4 h-4 transition-all ${wishlisted ? "fill-current" : ""}`} aria-hidden="true" />
            </button>

            {/* Quick add — CSS hover only */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
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
                <span className="px-5 py-2 bg-white/95 rounded-lg font-medium text-luxury-noir text-sm tracking-wide">
                  {T.coming_soon}
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
                {product.category[lang]}
              </span>
              <div className="flex items-center gap-1 text-sm" aria-label={`${product.rating} sur 5 (${product.reviews} ${T.reviews_count})`}>
                <Star className="w-3.5 h-3.5 text-accent fill-accent" aria-hidden="true" />
                <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                  {product.rating}
                </span>
                <span className="text-gray-400 text-xs">({product.reviews})</span>
              </div>
            </div>

            <h3 className="font-serif font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2.5 text-lg group-hover:text-accent transition-colors duration-300">
              {product.name[lang]}
            </h3>

            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice, lang)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  -{discount}%
                </span>
              )}
            </div>

            {product.colors?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3.5" aria-label={`${product.colors.length} ${lang === "fr" ? "coloris" : "colors"}`}>
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
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default memo(ProductCard);
