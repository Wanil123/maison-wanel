import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Minus,
  Plus,
  Check,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import { PRODUCTS } from "../data/products";
import { getProductFallback } from "../utils/imageFallback";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProductCard from "../components/ProductCard";
import StickyAddToCart from "../components/StickyAddToCart";
import RecentlyViewed from "../components/RecentlyViewed";
import usePageMeta from "../hooks/usePageMeta";

const COLOR_MAP = {
  noir: "#111", blanc: "#fff", marron: "#8B4513", cognac: "#C68E17",
  beige: "#F5F5DC", gris: "#808080", camel: "#C19A6B", indigo: "#4B0082",
  or: "#C9A96E", argent: "#C0C0C0", "bleu marine": "#000080", rouge: "#C41E3A",
  rose: "#F4C2C2", "rose poudré": "#E8C4C4", champagne: "#F7E7CE",
  bordeaux: "#6B2D4A", lavande: "#B57EDC", "bleu ciel": "#87CEEB",
  havane: "#8B6914", crème: "#FFFDD0", nude: "#E3BC9A",
};
const getColorHex = (color) => COLOR_MAP[(color || "").toLowerCase()] || "#ccc";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart, toggleWishlist, isWishlisted, trackView, MAX_QTY, addToast } = useApp();
  const T = STR[lang];

  const productId = useMemo(() => {
    const n = Number.parseInt(id, 10);
    return Number.isFinite(n) ? n : null;
  }, [id]);

  const product = useMemo(
    () => (productId == null ? null : PRODUCTS.find((p) => p.id === productId)),
    [productId]
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
      setQuantity(1);
      setImageLoaded(false);
      setImageError(false);
      trackView(product.id);
    }
  }, [product, trackView]);

  usePageMeta(
    product
      ? {
          title: `${product.name[lang]} — ${product.category[lang]}`,
          description: product.description[lang],
          jsonLd: {
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name[lang],
            description: product.description[lang],
            image: product.image,
            brand: { "@type": "Brand", name: "LuxeMode" },
            category: product.category[lang],
            offers: {
              "@type": "Offer",
              priceCurrency: "CAD",
              price: product.price,
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
          },
        }
      : { title: lang === "fr" ? "Produit introuvable" : "Product not found" }
  );

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-7xl font-serif font-bold text-gray-200 dark:text-gray-800">404</div>
          <h1 className="text-2xl font-bold mb-2 mt-2 text-gray-900 dark:text-white">
            {lang === "fr" ? "Produit introuvable" : "Product not found"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {lang === "fr"
              ? "Ce produit n'existe pas ou a été retiré."
              : "This product does not exist or has been removed."}
          </p>
          <Button onClick={() => navigate("/")}>{T.back_shop}</Button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(100 - (product.price / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize, color: selectedColor, qty: quantity });
  };

  const handleBuyNow = () => {
    addToCart(product, { size: selectedSize, color: selectedColor, qty: quantity });
    navigate("/cart");
  };

  const handleIncrement = () => {
    setQuantity((q) => {
      if (q >= MAX_QTY) {
        addToast(T.available_qty, "info");
        return q;
      }
      return q + 1;
    });
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category.en === product.category.en && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="container-luxe">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <Link
            to={`/?g=${product.gender}`}
            className="hover:text-gray-900 dark:hover:text-white transition-colors capitalize"
          >
            {product.gender === "femme" && (lang === "fr" ? "Femme" : "Women")}
            {product.gender === "homme" && (lang === "fr" ? "Homme" : "Men")}
            {product.gender === "enfant" && (lang === "fr" ? "Enfant" : "Children")}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]" aria-current="page">
            {product.name[lang]}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 sm:mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          {T.back_shop}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 dark:bg-luxury-charcoal/40 lg:sticky lg:top-24 shadow-xl">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 skeleton" aria-hidden="true" />
              )}

              <img
                src={imageError
                  ? getProductFallback({ seed: product.id, label: product.name[lang], category: product.category[lang], w: 800, h: 1067 })
                  : product.image}
                alt={`${product.name[lang]} — ${product.category[lang]}`}
                width={800}
                height={1067}
                className="relative z-10 w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageError(true); setImageLoaded(true); }}
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <Badge variant={product.badge} size="lg">
                    {T[product.badge]}
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge variant="sale" size="lg">
                    -{discount}%
                  </Badge>
                )}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product)}
                className={`
                  absolute top-4 right-4 w-12 h-12 rounded-full
                  flex items-center justify-center shadow-lg
                  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  ${
                    wishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/95 dark:bg-luxury-noir/90 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white"
                  }
                `}
                aria-label={wishlisted ? T.remove_from_wishlist : T.add_to_wishlist}
                aria-pressed={wishlisted}
              >
                <Heart className={`w-6 h-6 ${wishlisted ? "fill-current" : ""}`} aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              {product.category[lang]}
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mt-2 mb-3 sm:mb-4 leading-tight">
              {product.name[lang]}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6" aria-label={`${product.rating}/5 sur ${product.reviews} avis`}>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-accent fill-accent"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {product.rating} ({product.reviews} {T.reviews_count})
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                {product.inStock ? T.in_stock : T.out_of_stock}
              </span>
            </div>

            {/* Stock urgency — deterministic per product, demo only */}
            {product.inStock && (product.id % 5 === 0 || product.id % 7 === 0) && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                {lang === "fr" ? "Plus que quelques pièces en stock" : "Only a few pieces left in stock"}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice, lang)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {product.description[lang]}
            </p>

            {product.sizes?.length > 0 && (
              <fieldset className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <legend className="font-semibold text-gray-900 dark:text-white">
                    {T.size}
                  </legend>
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  >
                    {T.size_guide}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={T.size}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      role="radio"
                      aria-checked={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        min-w-[48px] h-12 px-4 rounded-xl font-medium
                        transition-colors duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                        ${
                          selectedSize === size
                            ? "bg-luxury-charcoal dark:bg-accent text-accent dark:text-luxury-noir ring-2 ring-offset-2 ring-accent"
                            : "bg-gray-100 dark:bg-luxury-charcoal/60 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-luxury-charcoal"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {product.colors?.length > 0 && (
              <fieldset className="mb-8">
                <legend className="font-semibold text-gray-900 dark:text-white mb-3 block">
                  {T.color}:{" "}
                  <span className="font-normal text-gray-600 dark:text-gray-400">{selectedColor}</span>
                </legend>
                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={T.color}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      role="radio"
                      aria-checked={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        relative inline-flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl border-2 transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                        ${
                          selectedColor === color
                            ? "border-luxury-charcoal dark:border-accent bg-luxury-charcoal/5 dark:bg-accent/10"
                            : "border-gray-200 dark:border-luxury-charcoal hover:border-gray-400 dark:hover:border-accent/40"
                        }
                      `}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-white/60 dark:border-luxury-noir/60 shadow-sm ring-1 ring-gray-300 dark:ring-luxury-charcoal"
                        style={{ backgroundColor: getColorHex(color) }}
                        aria-hidden="true"
                      />
                      <span className="text-gray-700 dark:text-gray-200 text-sm">{color}</span>
                      {selectedColor === color && (
                        <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border-2 border-gray-200 dark:border-luxury-charcoal rounded-xl" aria-label={T.quantity}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-luxury-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-l-xl"
                  aria-label={lang === "fr" ? "Diminuer la quantité" : "Decrease quantity"}
                >
                  <Minus className="w-5 h-5" aria-hidden="true" />
                </button>
                <span className="w-16 text-center font-semibold text-gray-900 dark:text-white" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= MAX_QTY}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-luxury-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-r-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={lang === "fr" ? "Augmenter la quantité" : "Increase quantity"}
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <Button
                size="lg"
                icon={ShoppingBag}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                {T.add_to_cart}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                {T.buy_now}
              </Button>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-luxury-charcoal/30 rounded-2xl border border-gray-100 dark:border-luxury-charcoal/60">
              {[
                { icon: Truck, title: T.free_shipping, desc: T.orders_over },
                { icon: Shield, title: T.secure_pay, desc: T.secure_badge },
                { icon: RotateCcw, title: T.free_returns, desc: T.returns_details },
              ].map((feature) => (
                <li key={feature.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {feature.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-20" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
              {lang === "fr" ? "Vous aimerez aussi" : "You might also like"}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Recently viewed (skips current product) */}
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* Sticky add-to-cart bar on mobile */}
      <StickyAddToCart
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        quantity={quantity}
      />

      {/* Extra padding for sticky bar on mobile to avoid hiding footer content */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}
