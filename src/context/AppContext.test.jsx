import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AppProvider, useApp } from "./AppContext";

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

const sampleProduct = {
  id: 1,
  name: { fr: "Robe", en: "Dress" },
  price: 100,
  image: "https://example.com/x.jpg",
  category: { fr: "Robes", en: "Dresses" },
  sizes: ["S", "M"],
  colors: ["Noir"],
  inStock: true,
};

describe("AppContext — cart", () => {
  it("adds a new product to cart", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.cart).toEqual([]);
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 }));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].qty).toBe(1);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.cartTotal).toBe(100);
  });

  it("merges quantities for same id+size+color", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 2 });
      result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 });
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].qty).toBe(3);
  });

  it("creates separate lines for different variants", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct, { size: "S", color: "Noir", qty: 1 });
      result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 });
    });
    expect(result.current.cart).toHaveLength(2);
  });

  it("caps quantity at MAX_QTY (99)", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 200 }));
    expect(result.current.cart[0].qty).toBe(99);
  });

  it("updates quantity via updateCartQty", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 }));
    act(() => result.current.updateCartQty(0, 5));
    expect(result.current.cart[0].qty).toBe(5);
    expect(result.current.cartCount).toBe(5);
  });

  it("removes item when qty drops to 0 or below", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 }));
    act(() => result.current.updateCartQty(0, 0));
    expect(result.current.cart).toEqual([]);
  });

  it("ignores out-of-range index gracefully", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 1 }));
    act(() => result.current.updateCartQty(42, 5)); // bogus index
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].qty).toBe(1);
  });

  it("clearCart empties the cart", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, { size: "M", color: "Noir", qty: 3 }));
    act(() => result.current.clearCart());
    expect(result.current.cart).toEqual([]);
    expect(result.current.cartTotal).toBe(0);
  });

  it("computes shipping (free over 100), tax 15%, grand total", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => result.current.addToCart({ ...sampleProduct, price: 50 }, { qty: 1 }));
    expect(result.current.cartShipping).toBe(15);
    expect(result.current.cartTax).toBeCloseTo(7.5, 2);
    expect(result.current.cartGrandTotal).toBeCloseTo(72.5, 2);

    act(() => result.current.addToCart({ ...sampleProduct, price: 100 }, { qty: 1 }));
    expect(result.current.cartShipping).toBe(0);
  });
});

describe("AppContext — wishlist", () => {
  it("toggles a product in/out of wishlist", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.isWishlisted(1)).toBe(false);
    act(() => result.current.toggleWishlist(sampleProduct));
    expect(result.current.isWishlisted(1)).toBe(true);
    expect(result.current.wishlist).toHaveLength(1);
    act(() => result.current.toggleWishlist(sampleProduct));
    expect(result.current.isWishlisted(1)).toBe(false);
    expect(result.current.wishlist).toEqual([]);
  });
});

describe("AppContext — language & theme", () => {
  it("defaults to French", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.lang).toBe("fr");
  });

  it("toggles dark mode", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.dark).toBe(false);
    act(() => result.current.toggleDark());
    expect(result.current.dark).toBe(true);
  });

  it("t() returns the right translation and falls back to FR", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    const cartFr = result.current.t("cart");
    act(() => result.current.setLang("en"));
    const cartEn = result.current.t("cart");
    expect(cartFr).not.toBe(cartEn);
    // Unknown key falls back to the key string
    expect(result.current.t("__missing_key__")).toBe("__missing_key__");
  });
});

describe("AppContext — recently viewed", () => {
  it("tracks viewed products in order, no duplicates, max 8", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    act(() => {
      for (let i = 1; i <= 10; i++) result.current.trackView(i);
    });
    expect(result.current.recentlyViewed).toHaveLength(8);
    expect(result.current.recentlyViewed[0]).toBe(10); // most recent first

    act(() => result.current.trackView(3));
    expect(result.current.recentlyViewed[0]).toBe(3);
    expect(result.current.recentlyViewed.filter((id) => id === 3)).toHaveLength(1);
  });
});

describe("AppContext — toasts", () => {
  it("assigns unique sequential IDs (no Date.now collision)", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    let id1, id2, id3;
    act(() => {
      id1 = result.current.addToast("a");
      id2 = result.current.addToast("b");
      id3 = result.current.addToast("c");
    });
    expect(new Set([id1, id2, id3]).size).toBe(3);
    expect(result.current.toasts).toHaveLength(3);
  });

  it("removeToast removes the right toast", () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    let id;
    act(() => { id = result.current.addToast("hello"); });
    act(() => result.current.removeToast(id));
    expect(result.current.toasts).toEqual([]);
  });
});
