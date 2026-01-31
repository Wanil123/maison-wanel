import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { STR } from "../data/translations";

// LocalStorage helpers
const load = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("LocalStorage save failed:", e);
  }
};

// Create Context
const AppContext = createContext(null);

// Provider Component
export function AppProvider({ children }) {
  // Language
  const [lang, setLang] = useState(() => load("lm_lang", "fr"));

  // Theme (default light)
  const [dark, setDark] = useState(() => load("lm_dark", false));

  // Cart
  const [cart, setCart] = useState(() => load("lm_cart", []));

  // Wishlist
  const [wishlist, setWishlist] = useState(() => load("lm_wishlist", []));

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage
  useEffect(() => save("lm_lang", lang), [lang]);
  useEffect(() => save("lm_dark", dark), [dark]);
  useEffect(() => save("lm_cart", cart), [cart]);
  useEffect(() => save("lm_wishlist", wishlist), [wishlist]);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Preconnect to image CDNs
  useEffect(() => {
    const cdns = ["https://images.unsplash.com", "https://images.pexels.com"];
    const links = cdns.map((href) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((l) => document.head.removeChild(l));
  }, []);

  // Toast functions
  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart functions
  const addToCart = useCallback((product, options = {}) => {
    const { size = "", color = "", qty = 1 } = options;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + qty,
        };
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
          qty,
        },
      ];
    });

    addToast(STR[lang].item_added, "success");
  }, [lang, addToast]);

  const updateCartQty = useCallback((index, qty) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      if (qty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], qty };
      }
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    addToast(STR[lang].item_removed, "info");
  }, [lang, addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  // Wishlist functions
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

  const isWishlisted = useCallback((productId) => {
    return wishlist.some((p) => p.id === productId);
  }, [wishlist]);

  // Theme toggle
  const toggleDark = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  // Translation helper
  const t = useCallback((key) => {
    return STR[lang][key] || key;
  }, [lang]);

  const value = useMemo(() => ({
    // Language
    lang,
    setLang,
    t,

    // Theme
    dark,
    toggleDark,

    // Cart
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,

    // Wishlist
    wishlist,
    toggleWishlist,
    isWishlisted,

    // Toasts
    toasts,
    addToast,
    removeToast,
  }), [lang, setLang, t, dark, toggleDark, cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal, cartCount, wishlist, toggleWishlist, isWishlisted, toasts, addToast, removeToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export default AppContext;
