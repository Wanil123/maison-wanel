import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProductCard from "../components/ProductCard";

const FALLBACK_IMAGE = "https://picsum.photos/seed/product/800/1200";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, addToCart, toggleWishlist, isWishlisted } = useApp();
  const T = STR[lang];

  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold mb-4">
            {lang === "fr" ? "Produit introuvable" : "Product not found"}
          </h1>
          <Button onClick={() => navigate("/")}>
            {T.back_shop}
          </Button>
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
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      qty: quantity,
    });
    navigate("/cart");
  };

  // Related products (same category)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category.en === product.category.en && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen py-8">
      <div className="container-luxe">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            {product.name[lang]}
          </span>
        </nav>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {T.back_shop}
        </motion.button>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 sticky top-24">
              {/* Skeleton */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 skeleton" />
              )}

              <img
                src={imageError ? FALLBACK_IMAGE : product.image}
                alt={product.name[lang]}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />

              {/* Badges */}
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

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWishlist(product)}
                className={`
                  absolute top-4 right-4 w-12 h-12 rounded-full
                  flex items-center justify-center shadow-lg
                  transition-colors
                  ${
                    wishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white"
                  }
                `}
              >
                <Heart className={`w-6 h-6 ${wishlisted ? "fill-current" : ""}`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category */}
            <span className="text-sm font-medium uppercase tracking-wider text-accent dark:text-accent">
              {product.category[lang]}
            </span>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {product.name[lang]}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
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

            {/* Price */}
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

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {product.description[lang]}
            </p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {T.size}
                  </span>
                  <button className="text-sm text-accent dark:text-accent hover:underline">
                    {T.size_guide}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        min-w-[48px] h-12 px-4 rounded-xl font-medium
                        transition-all duration-200
                        ${
                          selectedSize === size
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 ring-2 ring-offset-2 ring-gray-900 dark:ring-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <span className="font-semibold text-gray-900 dark:text-white mb-3 block">
                  {T.color}: <span className="font-normal text-gray-600 dark:text-gray-400">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        relative px-4 py-2 rounded-xl border-2 transition-all
                        ${
                          selectedColor === color
                            ? "border-gray-900 dark:border-white"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      <span className="text-gray-700 dark:text-gray-300">{color}</span>
                      {selectedColor === color && (
                        <motion.div
                          layoutId="color-check"
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white dark:text-gray-900" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-16 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                icon={ShoppingBag}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                {T.add_to_cart}
              </Button>

              {/* Buy Now */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                {T.buy_now}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              {[
                { icon: Truck, title: T.free_shipping, desc: T.orders_over },
                { icon: Shield, title: T.secure_pay, desc: T.secure_badge },
                { icon: RotateCcw, title: T.free_returns, desc: T.returns_details },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-accent dark:text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {feature.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">
              {lang === "fr" ? "Vous aimerez aussi" : "You might also like"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
