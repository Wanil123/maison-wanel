import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import Badge from "./ui/Badge";

const FALLBACK_IMAGE = "https://picsum.photos/seed/fashion/400/600";

// Pre-computed color map (avoid recalculating every render)
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
};

const getColorHex = (color) => COLOR_MAP[color.toLowerCase()] || "#ccc";

// Optimized image CDN: request 600px wide for cards
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
  const navigate = useNavigate();
  const { lang, addToCart, toggleWishlist, isWishlisted } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleNavigate = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleKeyNav = useCallback((e) => {
    if (e.key === "Enter") navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  // Cap stagger delay at 8 items max (avoid long delays for items 9-30)
  const cappedDelay = Math.min(index, 8) * 0.06;

  const thumbSrc = imageError ? FALLBACK_IMAGE : getThumbUrl(product.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: cappedDelay, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div
        role="link"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={handleKeyNav}
        className="cursor-pointer"
      >
        <div className="relative bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden luxury-card border border-gray-100 dark:border-gray-700/50">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800">
            {/* Skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 skeleton" />
            )}

            {/* Product Image — optimized size */}
            <img
              src={thumbSrc}
              alt={product.name[lang]}
              width={600}
              height={800}
              className={`
                w-full h-full object-cover img-zoom
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />

            {/* Hover overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300" />
            )}

            {/* Badges */}
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

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`
                absolute top-3 right-3 w-10 h-10 rounded-full
                flex items-center justify-center
                transition-all duration-300 shadow-lg
                ${
                  wishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white"
                }
              `}
              aria-label={wishlisted ? T.remove_from_wishlist : T.add_to_wishlist}
            >
              <Heart
                className={`w-4 h-4 transition-all ${wishlisted ? "fill-current" : ""}`}
              />
            </button>

            {/* Quick Actions — only render when hovered */}
            {isHovered && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 animate-fade-in">
                <button
                  onClick={handleQuickAdd}
                  disabled={!product.inStock}
                  className={`
                    flex-1 py-3 rounded-xl font-medium text-sm
                    flex items-center justify-center gap-2
                    transition-all duration-300 backdrop-blur-sm
                    ${
                      product.inStock
                        ? "bg-white/95 text-gray-900 hover:bg-white"
                        : "bg-gray-300/80 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.inStock ? T.add_to_cart : T.unavailable}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  aria-label={lang === "fr" ? "Aperçu rapide" : "Quick view"}
                  className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-5 py-2 bg-white/90 rounded-lg font-medium text-gray-900 text-sm tracking-wide">
                  {T.coming_soon}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent dark:text-accent">
                {product.category[lang]}
              </span>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">
                  {product.rating}
                </span>
                <span className="text-gray-400 text-xs">({product.reviews})</span>
              </div>
            </div>

            {/* Name */}
            <h3 className="font-serif font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2.5 text-lg group-hover:text-accent transition-colors duration-300">
              {product.name[lang]}
            </h3>

            {/* Price */}
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

            {/* Colors Preview */}
            {product.colors?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3.5">
                {product.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
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
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
