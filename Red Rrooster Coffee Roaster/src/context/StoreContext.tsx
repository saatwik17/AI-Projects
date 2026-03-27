import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  roast: string;
  type: string;
  region?: string;
  tags: string[];
  description: string;
  tastingNotes: string[];
  sizes: string[];
  isSubscription?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedGrind: string;
  quantity: number;
  purchaseType: 'onetime' | 'subscription';
  frequency?: string;
}

interface User {
  email: string;
  name: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if identical item exists
      const existing = prev.find(i => 
        i.id === item.id && 
        i.selectedSize === item.selectedSize && 
        i.selectedGrind === item.selectedGrind &&
        i.purchaseType === item.purchaseType &&
        i.frequency === item.frequency
      );

      if (existing) {
        return prev.map(i => 
          i.cartId === existing.cartId 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.cartId === cartId) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((total, item) => {
    // Simple price calculation - in reality size might affect price
    let price = item.price;
    if (item.selectedSize === '2LB') price *= 2.5;
    if (item.selectedSize === '5LB') price *= 6;
    
    if (item.purchaseType === 'subscription') {
      if (item.frequency === '1 Year') {
        price *= 0.80; // 20% off
      } else if (item.frequency === '2 Year') {
        price *= 0.75; // 25% off
      } else {
        price *= 0.85; // Monthly - 15% off
      }
    }
    
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const login = async (email: string, password: string) => {
    // Mock login
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ email, name: email.split('@')[0] });
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      user,
      login,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
