import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";
import { AppProvider } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import DealsPage from "./pages/DealsPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import BudgetPage from "./pages/BudgetPage";
import GroupOrderPage from "./pages/GroupOrderPage";
import ComboPage from "./pages/ComboPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/restaurants"
            element={<RestaurantsPage />}
          />
          <Route
            path="/restaurant/:id"
            element={<RestaurantDetailPage />}
          />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route
            path="/group-order"
            element={<GroupOrderPage />}
          />
          <Route path="/combo" element={<ComboPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}