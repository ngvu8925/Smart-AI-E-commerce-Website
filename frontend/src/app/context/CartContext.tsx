"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    brand: string;
    price: string;
    image: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error("Fetch cart error", err);
    }
  };

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login to add items to cart!");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  const removeFromCart = async (itemId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await fetch(`http://localhost:8000/api/cart/remove/${itemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error("Remove from cart error", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.product.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, fetchCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
