import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "canteenflow_cart_items";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  function addToCart(foodItem) {
    if (foodItem.available === false) {
      alert(`"${foodItem.name}" is currently unavailable.`);
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === foodItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === foodItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: foodItem.id,
          name: foodItem.name,
          price: foodItem.price,
          imageUrl: foodItem.imageUrl,
          category: foodItem.category,
          preparationTime: foodItem.preparationTime || 10,
          isVeg: foodItem.isVeg ?? true,
          quantity: 1,
        },
      ];
    });
    return true;
  }

  function increaseQuantity(id) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }

  function decreaseQuantity(id) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function getItemQuantity(id) {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const cartEstimatedWaitTime =
    cart.length > 0 ? Math.max(...cart.map((item) => item.preparationTime || 10)) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        cartCount,
        cartTotal,
        cartEstimatedWaitTime,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
