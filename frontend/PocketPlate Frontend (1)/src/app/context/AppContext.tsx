import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isStudent?: boolean;
  isAdmin?: boolean;
  preferences?: {
    dietary?: string;
    cuisine?: string;
    maxPrice?: number;
  };
  location?: string;
  savedCards?: PaymentCard[];
}

interface PaymentCard {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
}

interface Restaurant {
  id: string;
  name: string;
  emoji: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceFrom: number;
  isNew?: boolean;
  hasDeal?: boolean;
  isBudgetFriendly?: boolean;
  menu: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  available?: boolean;
}

interface CartItem {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
  expiresIn: string;
  category?: 'student' | 'card' | 'limited' | 'loyalty';
  isValid: boolean;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  budget: number;
  setBudget: (amount: number) => void;
  budgetPeriod: string;
  setBudgetPeriod: (period: string) => void;
  budgetRemaining: number;
  endOfMonthMode: boolean;
  toggleEndOfMonthMode: () => void;
  restaurants: Restaurant[];
  cart: CartItem[];
  addToCart: (restaurantId: string, restaurantName: string, item: MenuItem) => void;
  removeFromCart: (restaurantId: string, itemId: string) => void;
  updateCartQuantity: (restaurantId: string, itemId: string, quantity: number) => void;
  clearCart: () => void;
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher) => void;
  orders: any[];
  placeOrder: (orderData: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [budget, setBudgetState] = useState(15000); // PKR
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');
  const [budgetRemaining, setBudgetRemaining] = useState(4850);
  const [endOfMonthMode, setEndOfMonthMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Pakistani Restaurants Data
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Karachi Biryani House',
      emoji: '🍛',
      cuisine: 'Pakistani · Biryani',
      rating: 4.8,
      deliveryTime: '25 min',
      priceFrom: 450,
      isBudgetFriendly: true,
      hasDeal: true,
      menu: [
        { id: '1-1', name: 'Chicken Biryani', price: 450, description: 'Authentic Karachi style biryani' },
        { id: '1-2', name: 'Mutton Biryani', price: 650, description: 'Tender mutton with aromatic rice' },
        { id: '1-3', name: 'Raita', price: 80, description: 'Fresh yogurt with cucumber' }
      ]
    },
    {
      id: '2',
      name: 'Bundu Khan',
      emoji: '🍖',
      cuisine: 'BBQ · Desi',
      rating: 4.7,
      deliveryTime: '30 min',
      priceFrom: 600,
      isBudgetFriendly: true,
      menu: [
        { id: '2-1', name: 'Chicken Tikka', price: 650, description: 'Grilled chicken pieces' },
        { id: '2-2', name: 'Seekh Kabab', price: 600, description: 'Spiced minced meat kebabs' },
        { id: '2-3', name: 'Naan', price: 40, description: 'Fresh tandoori naan' }
      ]
    },
    {
      id: '3',
      name: 'Kolachi Restaurant',
      emoji: '🥘',
      cuisine: 'Pakistani · Continental',
      rating: 4.6,
      deliveryTime: '35 min',
      priceFrom: 800,
      menu: [
        { id: '3-1', name: 'Karahi Chicken', price: 950, description: 'Traditional chicken karahi' },
        { id: '3-2', name: 'Lamb Chops', price: 1400, description: 'Grilled lamb chops' },
        { id: '3-3', name: 'Garlic Naan', price: 60, description: 'Naan with garlic topping' }
      ]
    },
    {
      id: '4',
      name: 'Student Biryani',
      emoji: '🍚',
      cuisine: 'Fast Food · Desi',
      rating: 4.5,
      deliveryTime: '20 min',
      priceFrom: 350,
      isBudgetFriendly: true,
      hasDeal: true,
      menu: [
        { id: '4-1', name: 'Student Biryani', price: 350, description: 'Budget-friendly biryani' },
        { id: '4-2', name: 'Chicken Roll', price: 280, description: 'Spicy chicken wrapped in paratha' },
        { id: '4-3', name: 'Cold Drink', price: 100, description: 'Chilled beverage' }
      ]
    },
    {
      id: '5',
      name: 'Cafe Aylanto',
      emoji: '🥗',
      cuisine: 'Continental · Healthy',
      rating: 4.9,
      deliveryTime: '40 min',
      priceFrom: 1200,
      isNew: true,
      menu: [
        { id: '5-1', name: 'Caesar Salad', price: 1200, description: 'Fresh romaine with grilled chicken' },
        { id: '5-2', name: 'Grilled Salmon', price: 1800, description: 'Atlantic salmon with vegetables' },
        { id: '5-3', name: 'Pasta Primavera', price: 1400, description: 'Vegetables with penne' }
      ]
    },
    {
      id: '6',
      name: 'Subway Pakistan',
      emoji: '🥖',
      cuisine: 'Fast Food · Sandwiches',
      rating: 4.4,
      deliveryTime: '25 min',
      priceFrom: 550,
      isBudgetFriendly: true,
      menu: [
        { id: '6-1', name: 'Chicken Teriyaki Sub', price: 650, description: '6-inch sub with chicken' },
        { id: '6-2', name: 'Veggie Delite', price: 450, description: 'Fresh vegetables sub' },
        { id: '6-3', name: 'Cookies', price: 150, description: 'Chocolate chip cookies' }
      ]
    }
  ];

  const vouchers: Voucher[] = [
    {
      id: 'v1',
      code: 'POCKET20',
      discount: 20,
      type: 'percentage',
      description: 'Off your next order',
      expiresIn: '2 days',
      category: 'limited',
      isValid: true
    },
    {
      id: 'v2',
      code: 'STUDENT300',
      discount: 300,
      type: 'fixed',
      description: 'Student meal deal',
      expiresIn: '5 days',
      category: 'student',
      isValid: true
    },
    {
      id: 'v3',
      code: 'HBL15',
      discount: 15,
      type: 'percentage',
      description: 'HBL card cashback',
      expiresIn: 'End of month',
      category: 'card',
      isValid: true
    },
    {
      id: 'v4',
      code: 'FREEDEL',
      discount: 0,
      type: 'fixed',
      description: 'Free delivery pass',
      expiresIn: '1 use left this week',
      category: 'loyalty',
      isValid: true
    }
  ];

  const login = async (email: string, password: string) => {
    // Simulated login
    setUser({
      id: '1',
      name: 'Ahmed Ali',
      email,
      isStudent: email.includes('student'),
      isAdmin: email.includes('admin'),
      location: 'Lahore, Pakistan',
      savedCards: [
        { id: 'c1', last4: '4242', brand: 'HBL', expiry: '12/26' },
        { id: 'c2', last4: '5555', brand: 'UBL', expiry: '09/27' }
      ]
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulated registration
    setUser({
      id: Math.random().toString(),
      name,
      email,
      savedCards: []
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setAppliedVoucher(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const setBudget = (amount: number) => {
    setBudgetState(amount);
    setBudgetRemaining(amount * 0.32); // Simulated remaining
  };

  const toggleEndOfMonthMode = () => {
    setEndOfMonthMode(!endOfMonthMode);
  };

  const addToCart = (restaurantId: string, restaurantName: string, item: MenuItem) => {
    const existing = cart.find(c => c.restaurantId === restaurantId && c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c =>
        c.restaurantId === restaurantId && c.item.id === item.id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, { restaurantId, restaurantName, item, quantity: 1 }]);
    }
  };

  const removeFromCart = (restaurantId: string, itemId: string) => {
    setCart(cart.filter(c => !(c.restaurantId === restaurantId && c.item.id === itemId)));
  };

  const updateCartQuantity = (restaurantId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(restaurantId, itemId);
    } else {
      setCart(cart.map(c =>
        c.restaurantId === restaurantId && c.item.id === itemId
          ? { ...c, quantity }
          : c
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyVoucher = (voucher: Voucher) => {
    setAppliedVoucher(voucher);
  };

  const placeOrder = async (orderData: any) => {
    const newOrder = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      items: cart,
      total: orderData.total,
      status: 'confirmed',
      ...orderData
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setAppliedVoucher(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        budget,
        setBudget,
        budgetPeriod,
        setBudgetPeriod,
        budgetRemaining,
        endOfMonthMode,
        toggleEndOfMonthMode,
        restaurants,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        vouchers,
        appliedVoucher,
        applyVoucher,
        orders,
        placeOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
