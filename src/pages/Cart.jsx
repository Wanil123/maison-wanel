import { useId, useState } from "react";
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
  CheckCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import { getProductFallback } from "../utils/imageFallback";
import Button from "../components/ui/Button";
import usePageMeta from "../hooks/usePageMeta";
import { PROMO_CODES } from "../utils/pricing";

export default function Cart() {
  const {
    lang,
    cart,
    updateCartQty,
    removeFromCart,
    cartTotal,
    cartShipping,
    cartTax,
    cartGrandTotal,
    cartDiscount,
    promoCode,
    setPromoCode,
    FREE_SHIPPING_THRESHOLD,
    addToast,
  } = useApp();
  const navigate = useNavigate();
  const T = STR[lang];
  const promoInputId = useId();

  const [promoInput, setPromoInput] = useState("");
  const promoDiscount = cartDiscount;
  const progressPct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (code === promoCode) {
      addToast(T.promo_already_used, "info");
      return;
    }
    if (Object.hasOwn(PROMO_CODES, code)) {
      setPromoCode(code);
      addToast(`${T.promo_applied}: ${code} (-${PROMO_CODES[code] * 100}%)`, "success");
      setPromoInput("");
    } else {
      addToast(T.promo_invalid, "error");
    }
  };

  const removePromo = () => {
    setPromoCode("");
    addToast(lang === "fr" ? "Code promo retiré" : "Promo code removed", "info");
  };

  usePageMeta({
    title: T.cart,
    description:
      lang === "fr"
        ? "Consultez votre panier LuxeMode et essayez le récapitulatif de démonstration."
        : "Review your LuxeMode cart and try the demo summary.",
  });

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
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-luxury-charcoal/40 flex items-center justify-center"
          >
            <ShoppingBag className="w-12 h-12 text-gray-400" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
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
    <div className="min-h-screen py-4 sm:py-8">
      <div className="container-luxe">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
            {T.cart}
          </span>
        </nav>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4 sm:mb-8"
        >
          {T.cart_title(cart.length)}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => (
                <motion.article
                  key={`${item.id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  layout
                  className="flex gap-4 p-4 bg-white dark:bg-luxury-charcoal/40 rounded-2xl border border-gray-100 dark:border-luxury-charcoal shadow-sm"
                >
                  <Link to={`/product/${item.id}`} className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-gray-100 dark:bg-luxury-noir">
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        width={112}
                        height={144}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 motion-safe:transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getProductFallback({ seed: item.id, label: item.name[lang], category: item.category[lang], w: 200, h: 280 });
                        }}
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
                      <Link to={`/product/${item.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                        <h3 className="font-serif font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors">
                          {item.name[lang]}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.size && <span>{T.size}: {item.size}</span>}
                        {item.size && item.color && <span className="mx-2">•</span>}
                        {item.color && <span>{T.color}: {item.color}</span>}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        {formatPrice(item.price, lang)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      <div className="flex items-center border border-gray-200 dark:border-luxury-charcoal rounded-lg" role="group" aria-label={T.quantity}>
                        <button
                          type="button"
                          onClick={() => updateCartQty(index, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-luxury-charcoal transition-colors rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          aria-label={lang === "fr" ? "Diminuer" : "Decrease"}
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900 dark:text-white" aria-live="polite">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(index, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-luxury-charcoal transition-colors rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          aria-label={lang === "fr" ? "Augmenter" : "Increase"}
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.qty, lang)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          aria-label={`${T.remove_item} — ${item.name[lang]}`}
                        >
                          <Trash2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
              <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
              {T.continue_shopping}
            </Link>
          </div>

          <aside className="lg:col-span-1" aria-label={T.order_summary}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-gray-50 dark:bg-luxury-charcoal/30 rounded-2xl p-6 border border-gray-100 dark:border-luxury-charcoal"
            >
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                {T.order_summary}
              </h2>

              <form onSubmit={applyPromo} className="flex gap-2 mb-6" noValidate>
                <div className="relative flex-1">
                  <label htmlFor={promoInputId} className="sr-only">
                    {T.promo_code}
                  </label>
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id={promoInputId}
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={`${T.promo_code} (LUXE10)`}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-luxury-noir border border-gray-200 dark:border-luxury-charcoal text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <Button type="submit" variant="secondary" className="px-4">
                  {T.apply}
                </Button>
              </form>

              {promoCode && (
                <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    {promoCode} • -{PROMO_CODES[promoCode] * 100}%
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                  >
                    {lang === "fr" ? "Retirer" : "Remove"}
                  </button>
                </div>
              )}

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.subtotal}</dt>
                  <dd>{formatPrice(cartTotal, lang)}</dd>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <dt>{lang === "fr" ? "Remise" : "Discount"}</dt>
                    <dd>-{formatPrice(promoDiscount, lang)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.shipping}</dt>
                  <dd className={cartShipping === 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                    {cartShipping === 0 ? T.shipping_free : formatPrice(cartShipping, lang)}
                  </dd>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.taxes}</dt>
                  <dd>{formatPrice(cartTax, lang)}</dd>
                </div>

                <div className="border-t border-gray-200 dark:border-luxury-charcoal pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <dt>{T.total}</dt>
                    <dd>{formatPrice(cartGrandTotal, lang)}</dd>
                  </div>
                </div>
              </dl>

              {cartShipping > 0 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    {lang === "fr"
                      ? `Ajoutez ${formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal, lang)} pour simuler la livraison gratuite.`
                      : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal, lang)} to simulate free shipping.`}
                  </p>
                  <div
                    className="mt-2 h-2 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={Math.round(progressPct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={lang === "fr" ? "Progression livraison gratuite" : "Free shipping progress"}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-accent rounded-full"
                    />
                  </div>
                </div>
              )}

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

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                {lang === "fr" ? "Simulation — aucun paiement réel" : "Demo — no real payment"}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
