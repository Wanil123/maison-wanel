import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";

export default function StickyAddToCart({ product, selectedSize, selectedColor, quantity }) {
  const { lang, addToCart } = useApp();
  const T = STR[lang];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show once user has scrolled past the hero/first viewport (~280px on mobile).
      setVisible(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, { size: selectedSize, color: selectedColor, qty: quantity });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-luxury-noir/95 backdrop-blur-xl border-t border-gray-200 dark:border-luxury-charcoal shadow-2xl"
          role="region"
          aria-label={lang === "fr" ? "Ajout rapide au panier" : "Quick add to cart"}
        >
          <div className="container-luxe py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {product.name[lang]}
              </p>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-luxury-charcoal to-luxury-wine dark:from-accent dark:to-accent-light text-accent dark:text-luxury-noir font-semibold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {product.inStock ? T.add_to_cart : T.unavailable}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
