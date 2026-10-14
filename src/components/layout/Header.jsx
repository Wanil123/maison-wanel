import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";
import { PRODUCTS } from "../../data/products";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useFocusTrap(active, containerRef, onClose) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement;
    const focusables = container.querySelectorAll(focusableSelector);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKey);
    return () => {
      container.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef, onClose]);
}

function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export default function Header() {
  const { dark, toggleDark, lang, setLang, cartCount, wishlist } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const T = STR[lang];

  const mobileMenuRef = useRef(null);
  const searchModalRef = useRef(null);

  const isActiveLink = (linkTo) => {
    const [linkPath, linkQuery] = linkTo.split("?");
    if (linkQuery) {
      return location.pathname === linkPath && location.search === `?${linkQuery}`;
    }
    return location.pathname === linkPath && !location.search;
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  useFocusTrap(mobileMenuOpen, mobileMenuRef, closeMobileMenu);
  useFocusTrap(searchOpen, searchModalRef, closeSearch);
  useBodyScrollLock(mobileMenuOpen || searchOpen);

  const navLinks = useMemo(() => ([
    { to: "/", label: T.nav_shop },
    { to: "/?g=femme", label: lang === "fr" ? "Femme" : "Women" },
    { to: "/?g=homme", label: lang === "fr" ? "Homme" : "Men" },
    { to: "/?g=enfant", label: lang === "fr" ? "Enfant" : "Children" },
    { to: "/wishlist", label: T.nav_wishlist },
    { to: "/about", label: T.nav_about },
  ]), [lang, T]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return PRODUCTS.filter((p) => {
      const name = p.name[lang].toLowerCase();
      const cat = p.category[lang].toLowerCase();
      return name.includes(q) || cat.includes(q);
    }).slice(0, 6);
  }, [searchQuery, lang]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`
          sticky top-0 z-50
          bg-luxury-noir/90 backdrop-blur-xl
          transition-all duration-300 ease-out
          ${
            isScrolled
              ? "py-2 bg-luxury-noir/95 shadow-xl shadow-luxury-noir/40 border-b border-accent/15"
              : "py-4 border-b border-white/5"
          }
        `}
      >
        <div className="container-luxe">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group" aria-label="LuxeMode — Accueil">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center font-serif font-bold text-lg shadow-lg border bg-gradient-to-br from-accent to-accent-dark text-luxury-noir border-accent/40"
              >
                LM
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-xl font-serif font-bold tracking-tight text-white">
                  {T.brand}
                </div>
                <div className="text-[10px] uppercase tracking-[0.25em] -mt-0.5 text-accent">
                  {T.tagline}
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActiveLink(link.to) ? "page" : undefined}
                  className="relative font-medium transition-colors text-white/85 hover:text-accent"
                >
                  {link.label}
                  {link.to === "/wishlist" && wishlist.length > 0 && (
                    <span
                      className="absolute -top-2 -right-4 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-luxury-noir text-[10px] font-bold flex items-center justify-center"
                      aria-label={`${wishlist.length} ${lang === "fr" ? "favoris" : "favorites"}`}
                    >
                      {wishlist.length}
                    </span>
                  )}
                  {isActiveLink(link.to) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-light rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/10 text-white/85 hover:text-accent"
                aria-label={lang === "fr" ? "Rechercher" : "Search"}
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </motion.button>

              <div className="relative hidden sm:block">
                <label htmlFor="lang-select-desktop" className="sr-only">
                  {T.toggle_lang}
                </label>
                <select
                  id="lang-select-desktop"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="appearance-none cursor-pointer px-3 py-2 pr-8 rounded-xl font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 bg-white/10 text-white hover:bg-white/15 border border-white/10"
                >
                  <option value="fr" className="text-luxury-noir">FR</option>
                  <option value="en" className="text-luxury-noir">EN</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-70 text-white" aria-hidden="true" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleDark}
                className="p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/10 text-white/85 hover:text-accent"
                aria-label={dark ? T.light_mode : T.dark_mode}
                aria-pressed={dark}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {dark ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              <Link
                to="/cart"
                aria-label={`${T.cart} (${cartCount})`}
                className="relative p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/10 text-white/85 hover:text-accent"
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-accent text-luxury-noir text-[11px] font-bold flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-white/10 text-white/85 hover:text-accent"
                aria-label={T.menu}
                aria-haspopup="dialog"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label={T.menu}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white dark:bg-luxury-noir z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-luxury-charcoal">
                <span className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                  {T.menu}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={T.close}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4" aria-label="Navigation mobile">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                    >
                      <Link
                        to={link.to}
                        onClick={closeMobileMenu}
                        aria-current={isActiveLink(link.to) ? "page" : undefined}
                        className={`
                          flex items-center justify-between px-4 py-3 rounded-xl
                          font-medium transition-colors
                          ${
                            isActiveLink(link.to)
                              ? "bg-accent/10 dark:bg-accent/20 text-accent-dark dark:text-accent"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                          }
                        `}
                      >
                        {link.label}
                        {link.to === "/wishlist" && wishlist.length > 0 && (
                          <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-luxury-charcoal">
                  <div className="flex items-center justify-between px-4 py-3">
                    <label htmlFor="lang-select-mobile" className="text-gray-600 dark:text-gray-400">
                      {T.toggle_lang}
                    </label>
                    <select
                      id="lang-select-mobile"
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3">
                    <span id="dark-toggle-label" className="text-gray-600 dark:text-gray-400">
                      {T.toggle_dark}
                    </span>
                    <button
                      type="button"
                      onClick={toggleDark}
                      aria-labelledby="dark-toggle-label"
                      aria-pressed={dark}
                      className={`
                        w-14 h-8 rounded-full transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                        ${dark ? "bg-accent" : "bg-gray-300"}
                      `}
                    >
                      <motion.div
                        animate={{ x: dark ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                      >
                        {dark ? <Moon className="w-3.5 h-3.5 text-accent" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      </motion.div>
                    </button>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-luxury-charcoal grid grid-cols-2 gap-3">
                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-luxury-charcoal text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  {T.nav_wishlist}
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-luxury-charcoal to-luxury-wine dark:from-accent dark:to-accent-light text-accent dark:text-luxury-noir font-semibold shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  {T.cart} ({cartCount})
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 px-4"
            onClick={closeSearch}
          >
            <motion.div
              ref={searchModalRef}
              role="dialog"
              aria-modal="true"
              aria-label={lang === "fr" ? "Rechercher des produits" : "Search products"}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white dark:bg-luxury-noir rounded-2xl shadow-2xl overflow-hidden border border-accent/10"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-luxury-charcoal">
                  <Search className="w-5 h-5 text-accent" aria-hidden="true" />
                  <label htmlFor="header-search" className="sr-only">
                    {T.search_placeholder}
                  </label>
                  <input
                    id="header-search"
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={T.search_placeholder}
                    className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={T.close}
                  >
                    <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
                  </button>
                </div>
              </form>

              {searchQuery.trim().length >= 2 ? (
                searchResults.length > 0 ? (
                  <ul className="max-h-[60vh] overflow-y-auto p-2">
                    {searchResults.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/product/${p.id}`}
                          onClick={closeSearch}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={p.image}
                            alt=""
                            width={56}
                            height={72}
                            className="w-14 h-18 object-cover rounded-lg flex-shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {p.name[lang]}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-accent">
                              {p.category[lang]}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {p.price}$
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {T.no_products}
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {lang === "fr"
                    ? "Tapez au moins 2 caractères pour rechercher."
                    : "Type at least 2 characters to search."}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
