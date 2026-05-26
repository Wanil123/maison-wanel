import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { STR } from "../data/translations";

// Persistence helpers — safe against corrupted localStorage payloads.
const load = (key, defaultValue, validator) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) return defaultValue;
    return parsed;
  } catch {
    return defaultValue;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — swallow */
  }
};

const isArray = (v) => Array.isArray(v);
const isCartItem = (it) =>
  it && typeof it === "object" && typeof it.id === "number" && typeof it.qty === "number" && it.qty > 0;
const isWishItem = (it) => it && typeof it === "object" && typeof it.id === "number";

const MAX_QTY = 99;
const TAX_RATE = 0.15;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 15;

const AppContext = createContext(null);

let toastIdCounter = 0;

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const v = load("lm_lang", "fr");
    return v === "fr" || v === "en" ? v : "fr";
  });

  const [dark, setDark] = useState(() => load("lm_dark", false));

  const [cart, setCart] = useState(() => {
    const arr = load("lm_cart", [], isArray);
    return arr.filter(isCartItem);
  });

  const [wishlist, setWishlist] = useState(() => {
    const arr = load("lm_wishlist", [], isArray);
    return arr.filter(isWishItem);
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const arr = load("lm_recent", [], isArray);
    return arr.filter((it) => typeof it === "number").slice(0, 8);
  });

  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  useEffect(() => save("lm_lang", lang), [lang]);
  useEffect(() => save("lm_dark", dark), [dark]);
  useEffect(() => save("lm_cart", cart), [cart]);
  useEffect(() => save("lm_wishlist", wishlist), [wishlist]);
  useEffect(() => save("lm_recent", recentlyViewed), [recentlyViewed]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "fr" ? "fr-CA" : "en");
  }, [lang]);

  // Cross-tab sync: cart/wishlist update if another tab changes them.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "lm_cart" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (isArray(parsed)) setCart(parsed.filter(isCartItem));
        } catch { /* ignore */ }
      }
      if (e.key === "lm_wishlist" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (isArray(parsed)) setWishlist(parsed.filter(isWishItem));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, duration);
    toastTimers.current.set(id, timer);
    return id;
  }, []);

  const addToCart = useCallback((product, options = {}) => {
    const { size = "", color = "", qty = 1 } = options;
    const safeQty = Math.max(1, Math.min(MAX_QTY, Math.floor(qty) || 1));

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const next = Math.min(MAX_QTY, updated[existingIndex].qty + safeQty);
        updated[existingIndex] = { ...updated[existingIndex], qty: next };
        return updated;
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          color,
          qty: safeQty,
        },
      ];
    });

    addToast(STR[lang].item_added, "success");
  }, [lang, addToast]);

  const updateCartQty = useCallback((index, qty) => {
    setCart((prevCart) => {
      if (index < 0 || index >= prevCart.length) return prevCart;
      const updated = [...prevCart];
      if (qty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], qty: Math.min(MAX_QTY, Math.floor(qty)) };
      }
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    addToast(STR[lang].item_removed, "info");
  }, [lang, addToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );
  const cartShipping = useMemo(
    () => (cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST),
    [cartTotal]
  );
  const cartTax = useMemo(() => cartTotal * TAX_RATE, [cartTotal]);
  const cartGrandTotal = useMemo(
    () => cartTotal + cartShipping + cartTax,
    [cartTotal, cartShipping, cartTax]
  );

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        addToast(STR[lang].wishlist_removed, "info");
        return prev.filter((p) => p.id !== product.id);
      }
      addToast(STR[lang].wishlist_added, "success");
      return [...prev, product];
    });
  }, [lang, addToast]);

  const isWishlisted = useCallback(
    (productId) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const trackView = useCallback((productId) => {
    if (typeof productId !== "number") return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const toggleDark = useCallback(() => setDark((prev) => !prev), []);

  const t = useCallback((key) => STR[lang][key] ?? STR.fr[key] ?? key, [lang]);

  const value = useMemo(() => ({
    lang, setLang, t,
    dark, toggleDark,
    cart, addToCart, updateCartQty, removeFromCart, clearCart,
    cartTotal, cartCount, cartShipping, cartTax, cartGrandTotal,
    FREE_SHIPPING_THRESHOLD, MAX_QTY,
    wishlist, toggleWishlist, isWishlisted,
    recentlyViewed, trackView,
    toasts, addToast, removeToast,
  }), [
    lang, t, dark, toggleDark,
    cart, addToCart, updateCartQty, removeFromCart, clearCart,
    cartTotal, cartCount, cartShipping, cartTax, cartGrandTotal,
    wishlist, toggleWishlist, isWishlisted,
    recentlyViewed, trackView,
    toasts, addToast, removeToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export default AppContext;
