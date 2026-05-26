import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import { PRODUCTS } from "../data/products";
import { getProductFallback } from "../utils/imageFallback";

export default function RecentlyViewed({ excludeId }) {
  const { lang, recentlyViewed } = useApp();
  const T = STR[lang];

  const items = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-16" aria-labelledby="recent-heading">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 id="recent-heading" className="text-lg sm:text-2xl font-serif font-bold text-gray-900 dark:text-white">
          {T.recently_viewed}
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 4) * 0.05 }}
          >
            <Link
              to={`/product/${p.id}`}
              className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg sm:rounded-xl"
              aria-label={`${p.name[lang]} — ${formatPrice(p.price, lang)}`}
            >
              <div className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-luxury-charcoal/40 mb-1.5 sm:mb-2">
                <img
                  src={p.image}
                  alt={p.name[lang]}
                  width={300}
                  height={400}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getProductFallback({
                      seed: p.id, label: p.name[lang], category: p.category[lang], w: 300, h: 400,
                    });
                  }}
                />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-accent transition-colors">
                {p.name[lang]}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {formatPrice(p.price, lang)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
