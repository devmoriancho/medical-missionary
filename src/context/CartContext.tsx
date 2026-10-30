"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  priceKes: string;
  imageUrl: string;
  weightGrams: number;
  stockQuantity: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedCart = localStorage.getItem("mm_cart");

      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart) as CartItem[]);
        } catch (error) {
          console.error("Failed to parse saved cart:", error);
        }
      }

      setHasLoadedCart(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;
    localStorage.setItem("mm_cart", JSON.stringify(items));
  }, [hasLoadedCart, items]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        const targetQuantity = existingItem.quantity + 1;
        if (targetQuantity > newItem.stockQuantity) return prevItems;
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: targetQuantity } : item,
        );
      }
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (quantity > item.stockQuantity) return item;
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.priceKes) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error(
      "useCart must be used inside a CartProvider context boundary.",
    );
  return context;
}
