import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { STR } from "./data/translations";

// Lazy-loaded pages (code splitting)
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const About = lazy(() => import("./pages/About"));
const Thanks = lazy(() => import("./pages/Thanks"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Layout wrapper
function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-ivory dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

// 404 Page
function NotFound() {
  const { lang } = useApp();
  const T = STR[lang];
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-serif font-bold text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {lang === "fr" ? "Page non trouvée" : "Page not found"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
          {lang === "fr" ? "La page que vous recherchez n'existe pas." : "The page you are looking for does not exist."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-luxury-charcoal dark:bg-accent text-white dark:text-luxury-noir font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/thanks" element={<Thanks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
