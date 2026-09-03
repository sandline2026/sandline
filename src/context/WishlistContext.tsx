"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type WishlistItem = { id: string; name: string; price: number; image: string | null; slug?: string };

type WishlistContextType = {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sandline-wishlist");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("sandline-wishlist", JSON.stringify(items));
  }, [items, loaded]);

  function toggleWishlist(item: WishlistItem) {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  }

  function isWishlisted(id: string) {
    return items.some((i) => i.id === id);
  }

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
