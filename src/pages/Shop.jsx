import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, SlidersHorizontal, Grid3X3, LayoutGrid, Diamond } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import { PRODUCTS, CATEGORIES, GENDERS } from "../data/products";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import RecentlyViewed from "../components/RecentlyViewed";
import Button from "../components/ui/Button";
import usePageMeta from "../hooks/usePageMeta";

export default function Shop() {
  const { lang } = useApp();
  const T = STR[lang];
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    gender: "all",
    category: "all",
    sort: "featured",
    query: searchParams.get("q") || "",
  });

  usePageMeta({
    title: lang === "fr" ? "Boutique — Collection Printemps 2026" : "Shop — Spring 2026 Collection",
    description:
      lang === "fr"
        ? "Explorez le concept de boutique LuxeMode, un projet React de portfolio avec catalogue, favoris et panier de démonstration."
        : "Explore LuxeMode, a React portfolio storefront with a catalogue, favourites and demo cart.",
  });

  // Sync gender from URL query param without clobbering category if URL didn't request it.
  useEffect(() => {
    const g = searchParams.get("g");
    const q = searchParams.get("q") || "";
    setFilters((f) => ({
      ...f,
      gender: g && ["femme", "homme", "enfant"].includes(g) ? g : "all",
      query: q,
    }));
  }, [searchParams]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  // Get relevant categories based on selected gender
  const relevantCategories = useMemo(() => {
    if (filters.gender === "all") return CATEGORIES;
    const genderProducts = PRODUCTS.filter((p) => p.gender === filters.gender);
    const catValues = new Set(genderProducts.map((p) => p.category.en.toLowerCase()));
    return CATEGORIES.filter((c) => c.value === "all" || catValues.has(c.value));
  }, [filters.gender]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Gender filter
    if (filters.gender !== "all") {
      result = result.filter((p) => p.gender === filters.gender);
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter(
        (p) => p.category.en.toLowerCase() === filters.category
      );
    }

    // Search filter
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((p) => {
        const name = p.name[lang].toLowerCase();
        const cat = p.category[lang].toLowerCase();
        const desc = p.description[lang].toLowerCase();
        return name.includes(q) || cat.includes(q) || desc.includes(q);
      });
    }

    // Sort
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [filters, lang]);

  const clearFilters = () => {
    setFilters({ gender: "all", category: "all", sort: "featured", query: "" });
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen">
      {/* Hero — only on home (no gender filter) */}
      {filters.gender === "all" && <Hero />}

      {/* Shop Section */}
      <section id="products" className="py-12 md:py-16 scroll-mt-24" aria-labelledby="shop-heading">
        <div className="container-luxe">
          {/* Section Header — full version on home, compact when gender active */}
          {filters.gender === "all" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-accent mb-4">
                <Diamond className="w-3.5 h-3.5" />
                {lang === "fr" ? "Collection conceptuelle" : "Concept collection"}
                <Diamond className="w-3.5 h-3.5" />
              </span>
              <h2 id="shop-heading" className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-5">
                {lang === "fr" ? "Notre Collection" : "Our Collection"}
              </h2>
              <div className="luxury-divider w-24 mx-auto mb-5" />
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light text-lg leading-relaxed">
                {lang === "fr"
                  ? "Des pièces intemporelles, soigneusement sélectionnées pour votre style unique."
                  : "Timeless pieces, carefully curated for your unique style."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 id="shop-heading" className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
                {GENDERS.find((g) => g.value === filters.gender)?.[lang]}
              </h2>
              <div className="luxury-divider w-16 mt-3" />
            </motion.div>
          )}

          {/* Toolbar Row — search, sort, grid toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <label htmlFor="shop-search" className="sr-only">
                {T.search_placeholder}
              </label>
              <input
                id="shop-search"
                type="search"
                placeholder={T.search_placeholder}
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-gray-100 dark:bg-luxury-charcoal/60 border-2 border-transparent focus:border-accent text-gray-900 dark:text-white placeholder-gray-400 transition-colors outline-none text-sm"
              />
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-luxury-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={lang === "fr" ? "Effacer la recherche" : "Clear search"}
                >
                  <X className="w-3 h-3 text-gray-500" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:ml-auto">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={mobileFiltersOpen}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-luxury-charcoal/60 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-luxury-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                {T.filters}
              </button>

              {/* Sort */}
              <label htmlFor="shop-sort" className="sr-only">
                {lang === "fr" ? "Trier par" : "Sort by"}
              </label>
              <select
                id="shop-sort"
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-luxury-charcoal/60 text-gray-700 dark:text-gray-300 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
              >
                <option value="featured">{T.sort_featured}</option>
                <option value="price-asc">{T.sort_price_asc}</option>
                <option value="price-desc">{T.sort_price_desc}</option>
                <option value="newest">{T.sort_newest}</option>
              </select>

              {/* Grid Toggle - Desktop */}
              <div className="hidden xl:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setGridCols(3)}
                  aria-label={lang === "fr" ? "Afficher trois colonnes" : "Show three columns"}
                  aria-pressed={gridCols === 3}
                  className={`p-2 rounded-lg transition-colors ${
                    gridCols === 3
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridCols(4)}
                  aria-label={lang === "fr" ? "Afficher quatre colonnes" : "Show four columns"}
                  aria-pressed={gridCols === 4}
                  className={`p-2 rounded-lg transition-colors ${
                    gridCols === 4
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills — Desktop */}
          <div className="hidden lg:flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {relevantCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilters((f) => ({ ...f, category: cat.value }))}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${
                    filters.category === cat.value
                      ? "bg-luxury-charcoal dark:bg-white text-accent dark:text-gray-900 shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                {cat[lang]}
              </button>
            ))}
          </div>

          {/* Info bar — product count + active filter chips */}
          <div className="flex items-center justify-between mb-4 sm:mb-8 flex-wrap gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
              {filteredProducts.length} {T.products_count}
            </span>

            {/* Active filter chips (inline) */}
            {(filters.category !== "all" || filters.query) && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {filters.category !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent-dark dark:text-accent text-xs font-medium">
                    {CATEGORIES.find((c) => c.value === filters.category)?.[lang]}
                    <button
                      onClick={() => setFilters((f) => ({ ...f, category: "all" }))}
                      className="hover:text-accent-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.query && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 dark:bg-accent/20 text-accent-dark dark:text-accent text-xs font-medium">
                    &ldquo;{filters.query}&rdquo;
                    <button
                      onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                      className="hover:text-accent-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2"
                >
                  {T.clear_filters}
                </button>
              </div>
            )}
          </div>

          {/* Products Grid — 3 col mobile, plus large au-dela */}
          {filteredProducts.length > 0 ? (
            <div
              className={`
                grid gap-2 sm:gap-6 lg:gap-8
                grid-cols-2 sm:grid-cols-2 lg:grid-cols-3
                ${gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}
              `}
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-white mb-2">
                {T.no_products}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-light">
                {lang === "fr"
                  ? "Essayez de modifier vos filtres"
                  : "Try adjusting your filters"}
              </p>
              <Button onClick={clearFilters}>{T.clear_filters}</Button>
            </motion.div>
          )}

          {/* Recently viewed — only when no filters active to avoid noise */}
          {filters.gender === "all" && filters.category === "all" && !filters.query && (
            <RecentlyViewed />
          )}
        </div>
      </section>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                    {T.filters}
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
                    {lang === "fr" ? "Catégories" : "Categories"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {relevantCategories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFilters((f) => ({ ...f, category: cat.value }))}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all
                          ${
                            filters.category === cat.value
                              ? "bg-luxury-charcoal dark:bg-accent text-white dark:text-luxury-noir"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }
                        `}
                      >
                        {cat[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  fullWidth
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-4 bg-luxury-charcoal text-accent hover:bg-accent hover:text-luxury-noir"
                >
                  {lang === "fr" ? "Appliquer les filtres" : "Apply filters"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
