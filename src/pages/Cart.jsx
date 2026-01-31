import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import Button from "../components/ui/Button";

const FALLBACK_IMAGE = "https://picsum.photos/seed/cart/400/600";

export default function Cart() {
  const { lang, cart, updateCartQty, removeFromCart, cartTotal } = useApp();
  const navigate = useNavigate();
  const T = STR[lang];

  const shipping = cartTotal > 100 ? 0 : 15;
  const tax = cartTotal * 0.15;
  const total = cartTotal + shipping + tax;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {T.empty_cart_title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            {T.empty_cart_desc}
          </p>
          <Link to="/">
            <Button icon={ArrowRight} iconPosition="right">
              {T.continue_shopping}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
            {T.cart}
          </span>
        </nav>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8"
        >
          {T.cart_title(cart.length)}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-32 sm:w-32 sm:h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-accent dark:hover:text-accent transition-colors">
                          {item.name[lang]}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.size && (
                          <span>
                            {T.size}: {item.size}
                          </span>
                        )}
                        {item.size && item.color && <span className="mx-2">•</span>}
                        {item.color && (
                          <span>
                            {T.color}: {item.color}
                          </span>
                        )}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        {formatPrice(item.price, lang)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => updateCartQty(index, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900 dark:text-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(index, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.qty, lang)}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link to="/" className="inline-flex items-center gap-2 text-accent dark:text-accent hover:underline mt-4">
              <ArrowRight className="w-4 h-4 rotate-180" />
              {T.continue_shopping}
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {T.order_summary}
              </h2>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={T.promo_code}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  />
                </div>
                <Button variant="secondary" className="px-4">
                  {T.apply}
                </Button>
              </div>

              {/* Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.subtotal}</span>
                  <span>{formatPrice(cartTotal, lang)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.shipping}</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                    {shipping === 0 ? T.shipping_free : formatPrice(shipping, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.taxes}</span>
                  <span>{formatPrice(tax, lang)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>{T.total}</span>
                    <span>{formatPrice(total, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {shipping > 0 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {lang === "fr"
                      ? `Ajoutez ${formatPrice(100 - cartTotal, lang)} pour la livraison gratuite!`
                      : `Add ${formatPrice(100 - cartTotal, lang)} more for free shipping!`}
                  </p>
                  <div className="mt-2 h-2 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cartTotal / 100) * 100}%` }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate("/checkout")}
                className="mt-6"
              >
                {T.checkout}
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {T.secure_badge}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
