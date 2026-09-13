"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

const EMPTY = { items: [], count: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };

export default function CartProvider({ children }) {
  const { status } = useSession();
  const [cart, setCart] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const signedIn = status === "authenticated";

  const request = useCallback(async (method, { body, query } = {}) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/cart${query || ""}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update your cart");
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setPending(false);
    }
  }, []);

  // Load the cart once the user is known to be signed in.
  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    fetch("/api/cart")
      .then((res) => (res.ok ? res.json() : EMPTY))
      .catch(() => EMPTY)
      .then((data) => {
        if (!active) return;
        setCart(data);
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [signedIn]);

  const addItem = useCallback((payload) => request("POST", { body: payload }), [request]);
  const setQuantity = useCallback(
    (itemId, quantity) => request("PATCH", { body: { itemId, quantity } }),
    [request]
  );
  const removeItem = useCallback(
    (itemId) => request("DELETE", { query: `?itemId=${encodeURIComponent(itemId)}` }),
    [request]
  );
  const clearCart = useCallback(() => request("DELETE"), [request]);

  // Signed-out visitors always see an empty cart.
  const visible = signedIn ? cart : EMPTY;

  return (
    <CartContext.Provider
      value={{
        ...visible,
        loading: status === "loading" || (signedIn && !loaded),
        pending,
        error,
        signedIn,
        sessionStatus: status,
        addItem,
        setQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
