"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type AppliedCoupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  discountAmount: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("sandline-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {}
    }

    const savedCoupon = localStorage.getItem("sandline-coupon");
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch {}
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("sandline-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  useEffect(() => {
    if (loaded) {
      if (appliedCoupon) {
        localStorage.setItem("sandline-coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("sandline-coupon");
      }
    }
  }, [appliedCoupon, loaded]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Recalculate discount if coupon is present
  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discount_type === "percentage") {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discount = Math.min(subtotal, appliedCoupon.discount_value);
    }
    discount = Math.round(discount * 100) / 100;
  }

  const total = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  async function applyCoupon(code: string): Promise<{ success: boolean; error?: string }> {
    if (!code || !code.trim()) {
      return { success: false, error: "Please enter a coupon code." };
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        return { success: false, error: data.error || "Invalid coupon code." };
      }

      setAppliedCoupon(data.coupon);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to apply coupon";
      return { success: false, error: message };
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        total,
        itemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
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
