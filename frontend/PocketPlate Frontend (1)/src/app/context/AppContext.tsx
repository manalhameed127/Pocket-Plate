import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isStudent?: boolean;
  isAdmin?: boolean;
  status?: string;
  preferences?: {
    dietary?: string;
    cuisine?: string;
    maxPrice?: number;
  };
  location?: string;
  savedCards?: PaymentCard[];
}

interface AdminUser extends User {
  joinedDate?: string;
}

interface Metrics {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalOffers: number;
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
  description?: string;
  location?: string;
  image?: string;
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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addPaymentCard: (card: Omit<PaymentCard, 'id'>) => PaymentCard | null;
  budget: number;
  setBudget: (amount: number) => void;
  budgetPeriod: string;
  setBudgetPeriod: (period: string) => void;
  budgetRemaining: number;
  endOfMonthMode: boolean;
  toggleEndOfMonthMode: () => void;
  restaurants: Restaurant[];
  adminUsers: AdminUser[];
  metrics: Metrics;
  fetchAdminUsers: () => Promise<void>;
  fetchAdminRestaurants: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  createRestaurant: (restaurant: Omit<Restaurant, 'id' | 'emoji' | 'rating' | 'deliveryTime' | 'menu'> & { city: string; address: string }) => Promise<void>;
  updateRestaurant: (id: string, payload: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateOffer: (id: string, update: Partial<Voucher>) => Promise<void>;
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
  const initialRestaurants: Restaurant[] = [
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

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [budget, setBudgetState] = useState(15000);
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');
  const [budgetRemaining, setBudgetRemaining] = useState(4850);
  const [endOfMonthMode, setEndOfMonthMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [metrics, setMetrics] = useState<Metrics>({ totalUsers: 0, totalRestaurants: 0, totalOrders: 0, totalOffers: 0 });

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

  const buildHeaders = (includeJson = true, authToken?: string) => {
    const headers: Record<string, string> = {};
    if (includeJson) headers['Content-Type'] = 'application/json';
    const tokenToUse = authToken ?? token;
    if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;
    return headers;
  };

  const mapBackendRestaurantToFrontend = (restaurant: any): Restaurant => ({
    id: restaurant._id ?? restaurant.id ?? Math.random().toString(),
    name: restaurant.name ?? 'New Restaurant',
    emoji: restaurant.name ? restaurant.name.charAt(0).toUpperCase() : '🍽️',
    cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' · ') : restaurant.cuisine ?? 'General',
    rating: restaurant.rating ?? 4.5,
    deliveryTime: restaurant.deliveryTime ?? (restaurant.hours ? `${restaurant.hours.open ?? '10:00'} - ${restaurant.hours.close ?? '23:00'}` : '30 min'),
    priceFrom: restaurant.priceFrom ?? (restaurant.priceRange === '$' ? 300 : restaurant.priceRange === '$$' ? 550 : restaurant.priceRange === '$$$' ? 900 : 500),
    menu: restaurant.menu ?? [],
    isNew: restaurant.isNewlyOpened ?? false,
    hasDeal: restaurant.hasDeal ?? false,
    isBudgetFriendly: restaurant.isBudgetFriendly ?? false
  });

  const mapBackendUserToFrontend = (backendUser: any): AdminUser => ({
    id: backendUser._id ?? backendUser.id ?? Math.random().toString(),
    name: backendUser.name ?? 'Unknown',
    email: backendUser.email ?? '',
    isStudent: backendUser.isStudent ?? false,
    isAdmin: backendUser.isAdmin ?? false,
    status: backendUser.status ?? 'Active',
    joinedDate: backendUser.createdAt ? new Date(backendUser.createdAt).toISOString().split('T')[0] : 'Unknown',
    location: backendUser.location,
    savedCards: backendUser.savedCards ?? []
  });

  const [vouchers, setVouchers] = useState<Voucher[]>([
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
  ]);

  useEffect(() => {
    const storedToken = localStorage.getItem('pp_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // FIX: Separate admin-only fetches from regular user profile fetch.
  // Previously, fetchAdminRestaurants() was always called on login, and if
  // the /admin/restaurants endpoint failed it would leave restaurants empty.
  useEffect(() => {
    if (!token) {
      setAdminUsers([]);
      return;
    }

    const loadUserData = async () => {
      const fetchedUser = await fetchProfile();
      // Only fetch admin data if the user is actually an admin
      if (fetchedUser?.isAdmin) {
        await Promise.all([fetchAdminUsers(), fetchAdminRestaurants(), fetchMetrics()]);
      }
      // Non-admin users keep initialRestaurants — no backend call needed
    };

    loadUserData();
  }, [token]);

  // FIX: Return the user object so the caller can check isAdmin before
  // deciding whether to fetch admin-only endpoints.
  const fetchProfile = async (authToken?: string): Promise<User | null> => {
    const tokenToUse = authToken || token;
    if (!tokenToUse) return null;
    try {
      const response = await fetch(`${apiBaseUrl}/users/profile`, {
        headers: buildHeaders(true, tokenToUse)
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (data?.user) {
        const mappedUser: User = {
          id: data.user._id ?? data.user.id ?? 'unknown',
          name: data.user.name,
          email: data.user.email,
          isStudent: data.user.isStudent ?? false,
          isAdmin: data.user.isAdmin ?? false,
          status: data.user.status,
          location: data.user.location,
          savedCards: data.user.savedCards ?? []
        };
        setUser(mappedUser);
        return mappedUser;
      }
    } catch {
      // silently fail — user stays null
    }
    return null;
  };

  const fetchAdminUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/admin/users`, {
        headers: buildHeaders()
      });
      if (!response.ok) return;
      const data = await response.json();
      setAdminUsers(data.map(mapBackendUserToFrontend));
    } catch {
      // silently fail — adminUsers stays empty
    }
  };

  // FIX: Only overwrite restaurants if the backend returns a non-empty array.
  // Previously a failed/empty response would wipe out initialRestaurants.
  const fetchAdminRestaurants = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/admin/restaurants`, {
        headers: buildHeaders()
      });
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRestaurants(data.map(mapBackendRestaurantToFrontend));
      }
      // If backend returns empty array, keep initialRestaurants
    } catch {
      // Network error — keep initialRestaurants
    }
  };

  const fetchMetrics = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiBaseUrl}/admin/metrics`, {
        headers: buildHeaders()
      });
      if (!response.ok) return;
      const data = await response.json();
      setMetrics(data);
    } catch {
      // silently fail
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    localStorage.setItem('pp_token', data.token);

    // Fetch profile immediately after login so isAdmin is known
    const fetchedUser = await fetchProfile(data.token);

    // Only fetch admin data if this user is actually an admin
    if (fetchedUser?.isAdmin) {
      await Promise.all([fetchAdminUsers(), fetchAdminRestaurants(), fetchMetrics()]);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setAppliedVoucher(null);
    // Restore initial restaurants on logout so they're ready for next login
    setRestaurants(initialRestaurants);
    localStorage.removeItem('pp_token');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const createRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'emoji' | 'rating' | 'deliveryTime' | 'menu'> & { city: string; address: string }) => {
    const response = await fetch(`${apiBaseUrl}/admin/integration`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({
        name: restaurant.name,
        description: restaurant.description ?? '',
        location: {
          address: restaurant.address,
          city: restaurant.city
        },
        cuisine: [restaurant.cuisine],
        priceRange: restaurant.priceFrom <= 500 ? '$' : restaurant.priceFrom <= 900 ? '$$' : '$$$',
        hours: {
          open: '10:00',
          close: '23:00'
        },
        image: ''
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to create restaurant');
    }

    const data = await response.json();
    setRestaurants(prev => [mapBackendRestaurantToFrontend(data.restaurant), ...prev]);
  };

  const updateRestaurant = async (id: string, payload: Partial<Restaurant>) => {
    const response = await fetch(`${apiBaseUrl}/admin/restaurants/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify({
        name: payload.name,
        description: payload.description,
        location: payload.location,
        cuisine: payload.cuisine ? [payload.cuisine] : undefined,
        priceRange: payload.priceFrom ? (payload.priceFrom <= 500 ? '$' : payload.priceFrom <= 900 ? '$$' : '$$$') : undefined,
        hours: payload.deliveryTime ? { open: '10:00', close: '23:00' } : undefined,
        image: payload.image
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to update restaurant');
    }

    const data = await response.json();
    setRestaurants(prev => prev.map(item => item.id === id ? mapBackendRestaurantToFrontend(data) : item));
  };

  const deleteRestaurant = async (id: string) => {
    const response = await fetch(`${apiBaseUrl}/admin/restaurants/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(false)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to delete restaurant');
    }

    setRestaurants(prev => prev.filter(item => item.id !== id));
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    const response = await fetch(`${apiBaseUrl}/admin/users/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to update user');
    }

    const data = await response.json();
    setAdminUsers(prev => prev.map(userItem => userItem.id === id ? mapBackendUserToFrontend(data) : userItem));
  };

  const deleteUser = async (id: string) => {
    const response = await fetch(`${apiBaseUrl}/admin/users/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(false)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to delete user');
    }

    setAdminUsers(prev => prev.filter(userItem => userItem.id !== id));
  };

  const updateOffer = async (id: string, update: Partial<Voucher>) => {
    const response = await fetch(`${apiBaseUrl}/admin/offers/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(update)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to update offer');
    }

    const data = await response.json();
    setVouchers(prev => prev.map(voucher => voucher.id === id ? { ...voucher, ...update, ...data.offer } : voucher));
  };

  const addPaymentCard = (card: Omit<PaymentCard, 'id'>) => {
    if (!user) return null;

    const newCard = {
      id: Math.random().toString(36).slice(2),
      ...card
    };

    setUser({
      ...user,
      savedCards: [...(user.savedCards || []), newCard]
    });

    return newCard;
  };

  const setBudget = (amount: number) => {
    setBudgetState(amount);
    setBudgetRemaining(amount * 0.32);
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
        token,
        login,
        register,
        logout,
        updateProfile,
        addPaymentCard,
        budget,
        setBudget,
        budgetPeriod,
        setBudgetPeriod,
        budgetRemaining,
        endOfMonthMode,
        toggleEndOfMonthMode,
        restaurants,
        adminUsers,
        metrics,
        fetchAdminUsers,
        fetchAdminRestaurants,
        fetchMetrics,
        createRestaurant,
        updateRestaurant,
        deleteRestaurant,
        updateUser,
        deleteUser,
        updateOffer,
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