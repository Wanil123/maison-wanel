import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import ProductCard from "../components/ProductCard";
import Button from "../components/ui/Button";
import usePageMeta from "../hooks/usePageMeta";

export default function Wishlist() {
  const { lang, wishlist, addToCart, addToast } = useApp();
  const T = STR[lang];

  usePageMeta({
    title: T.nav_wishlist,
    description:
      lang === "fr"
        ? "Vos pièces favorites LuxeMode. Retrouvez-les ici et ajoutez-les au panier en un clic."
        : "Your favorite LuxeMode pieces. Find them here and add them to cart in one click.",
  });

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    let added = 0;
    wishlist.forEach((product) => {
      if (product.inStock) {
        addToCart(product, {
          size: product.sizes?.[0] || "",
          color: product.colors?.[0] || "",
          qty: 1,
        });
        added++;
      }
    });
    if (added === 0) {
      addToast(lang === "fr" ? "Aucun article disponible" : "No items available", "info");
    }
  };

  if (wishlist.length === 0) {
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
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-luxury-rose/20 dark:bg-luxury-rose/10 flex items-center justify-center"
          >
            <Heart className="w-12 h-12 text-luxury-rose" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {T.wishlist_empty_title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
            {T.wishlist_empty_desc}
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
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
            {T.nav_wishlist}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
            {T.my_wishlist(wishlist.length)}
          </h1>
          <Button variant="secondary" icon={ShoppingBag} onClick={handleMoveAllToCart}>
            {lang === "fr" ? "Tout ajouter au panier" : "Add all to cart"}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link to="/">
            <Button variant="ghost" icon={ShoppingBag}>
              {T.continue_shopping}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
