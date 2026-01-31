import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";

export default function Header() {
  const { dark, toggleDark, lang, setLang, cartCount, wishlist } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const T = STR[lang];

  const isActiveLink = (linkTo) => {
    const [linkPath, linkQuery] = linkTo.split("?");
    if (linkQuery) {
      return location.pathname === linkPath && location.search === `?${linkQuery}`;
    }
    return location.pathname === linkPath && !location.search;
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: T.nav_shop },
    { to: "/?g=femme", label: lang === "fr" ? "Femme" : "Women" },
    { to: "/?g=homme", label: lang === "fr" ? "Homme" : "Men" },
    { to: "/?g=enfant", label: lang === "fr" ? "Enfant" : "Children" },
    { to: "/wishlist", label: T.nav_wishlist },
    { to: "/about", label: T.nav_about },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${
            isScrolled
              ? "py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5"
              : "py-4 bg-transparent"
          }
        `}
      >
        <div className="container-luxe">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center
                  font-serif font-bold text-lg shadow-lg border
                  ${
                    isScrolled || dark
                      ? "bg-luxury-charcoal text-accent border-accent/20 dark:bg-accent dark:text-luxury-noir dark:border-accent"
                      : "bg-luxury-charcoal/90 text-accent border-accent/20"
                  }
                `}
              >
                LM
              </motion.div>
              <div className="hidden sm:block">
                <div
                  className={`
                    text-xl font-serif font-bold tracking-tight
                    ${isScrolled ? "text-gray-900 dark:text-white" : dark ? "text-white" : "text-white"}
                  `}
                >
                  {T.brand}
                </div>
                <div
                  className={`
                    text-[10px] uppercase tracking-[0.25em] -mt-0.5
                    ${isScrolled ? "text-accent dark:text-accent" : "text-accent/80"}
                  `}
                >
                  {T.tagline}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative font-medium transition-colors
                    ${
                      isScrolled
                        ? "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        : dark
                        ? "text-gray-200 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }
                  `}
                >
                  {link.label}
                  {link.to === "/wishlist" && wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-4 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                  {isActiveLink(link.to) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-light rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className={`
                  p-2.5 rounded-xl transition-colors
                  ${
                    isScrolled
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      : dark
                      ? "hover:bg-white/10 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Language Selector */}
              <div className="relative hidden sm:block">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className={`
                    appearance-none cursor-pointer
                    px-3 py-2 pr-8 rounded-xl font-medium text-sm
                    transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50
                    ${
                      isScrolled
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        : dark
                        ? "bg-white/10 text-white"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60" />
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDark}
                className={`
                  p-2.5 rounded-xl transition-colors
                  ${
                    isScrolled
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      : dark
                      ? "hover:bg-white/10 text-yellow-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                aria-label={dark ? T.light_mode : T.dark_mode}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dark ? "sun" : "moon"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Cart Button */}
              <Link to="/cart" aria-label={`${T.cart} (${cartCount})`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-2.5 rounded-xl transition-colors
                    ${
                      isScrolled
                        ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        : dark
                        ? "hover:bg-white/10 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-luxury-noir text-xs font-bold flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(true)}
                className={`
                  lg:hidden p-2.5 rounded-xl transition-colors
                  ${
                    isScrolled
                      ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      : dark
                      ? "hover:bg-white/10 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
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
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {T.menu}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center justify-between px-4 py-3 rounded-xl
                            font-medium transition-colors
                            ${
                              isActiveLink(link.to)
                                ? "bg-accent/10 dark:bg-accent/20 text-accent-dark dark:text-accent"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-gray-600 dark:text-gray-400">{T.toggle_lang}</span>
                      <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                      >
                        <option value="fr">Francais</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-gray-600 dark:text-gray-400">{T.toggle_dark}</span>
                      <button
                        onClick={toggleDark}
                        className={`
                          w-14 h-8 rounded-full transition-colors relative
                          ${dark ? "bg-accent" : "bg-gray-300"}
                        `}
                      >
                        <motion.div
                          animate={{ x: dark ? 24 : 4 }}
                          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                        >
                          {dark ? (
                            <Moon className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-luxury-charcoal to-luxury-wine dark:from-accent dark:to-accent-light text-white dark:text-luxury-noir font-semibold"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {T.cart} ({cartCount})
                  </Link>
                </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder={T.search_placeholder}
                  className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {T.search_placeholder}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
